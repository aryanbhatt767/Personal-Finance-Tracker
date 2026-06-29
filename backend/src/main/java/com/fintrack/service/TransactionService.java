package com.fintrack.service;

import com.fintrack.model.Transaction;
import com.fintrack.model.User;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class TransactionService {

    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;

    public List<Transaction> getAllByUser(Long userId) {
        return transactionRepository.findByUserIdOrderByDateDesc(userId);
    }

    public List<Transaction> getByUserAndType(Long userId, String type) {
        return transactionRepository.findByUserIdAndTypeOrderByDateDesc(userId, type);
    }

    public List<Transaction> getByUserAndDateRange(Long userId, LocalDate from, LocalDate to) {
        return transactionRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, from, to);
    }

    public Transaction getById(Long id, Long userId) {
        return transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }

    public Transaction create(Transaction txn, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        txn.setUser(user);
        return transactionRepository.save(txn);
    }

    public Transaction update(Long id, Transaction updated, Long userId) {
        Transaction existing = getById(id, userId);
        existing.setName(updated.getName());
        existing.setAmount(updated.getAmount());
        existing.setType(updated.getType());
        existing.setCategory(updated.getCategory());
        existing.setIcon(updated.getIcon());
        existing.setColor(updated.getColor());
        existing.setDate(updated.getDate());
        existing.setNotes(updated.getNotes());
        return transactionRepository.save(existing);
    }

    public void delete(Long id, Long userId) {
        Transaction txn = getById(id, userId);
        transactionRepository.delete(txn);
    }

    public BigDecimal getTotalByType(Long userId, String type) {
        BigDecimal total = transactionRepository.sumByUserIdAndType(userId, type);
        return total != null ? total : BigDecimal.ZERO;
    }

    public List<Object[]> getCategoryBreakdown(Long userId) {
        return transactionRepository.findCategoryBreakdownByUserId(userId);
    }

    public List<Object[]> getMonthlyTrend(Long userId) {
        return transactionRepository.findMonthlyTrendByUserId(userId);
    }

    public long countByUser(Long userId) {
        return transactionRepository.countByUserId(userId);
    }
}
