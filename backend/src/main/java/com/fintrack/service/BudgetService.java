package com.fintrack.service;

import com.fintrack.model.Budget;
import com.fintrack.model.User;
import com.fintrack.repository.BudgetRepository;
import com.fintrack.repository.TransactionRepository;
import com.fintrack.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class BudgetService {

    @Autowired private BudgetRepository budgetRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;

    public List<Budget> getAllByUser(Long userId) {
        return budgetRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Budget> getByUserAndMonth(Long userId, String monthYear) {
        return budgetRepository.findByUserIdAndMonthYear(userId, monthYear);
    }

    public Budget createOrUpdate(Budget budget, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return budgetRepository
                .findByUserIdAndCategoryAndMonthYear(userId, budget.getCategory(), budget.getMonthYear())
                .map(existing -> {
                    existing.setAmount(budget.getAmount());
                    return budgetRepository.save(existing);
                })
                .orElseGet(() -> {
                    budget.setUser(user);
                    return budgetRepository.save(budget);
                });
    }

    public Budget update(Long id, Budget updated, Long userId) {
        Budget existing = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        existing.setCategory(updated.getCategory());
        existing.setAmount(updated.getAmount());
        existing.setMonthYear(updated.getMonthYear());
        return budgetRepository.save(existing);
    }

    public void delete(Long id, Long userId) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        budgetRepository.delete(budget);
    }

    public BigDecimal getSpentForCategory(Long userId, String category, String monthYear) {
        String[] parts = monthYear.split("-");
        int year = Integer.parseInt(parts[0]);
        int month = Integer.parseInt(parts[1]);
        LocalDate from = LocalDate.of(year, month, 1);
        LocalDate to = from.withDayOfMonth(from.lengthOfMonth());
        BigDecimal spent = transactionRepository.sumByUserIdAndTypeAndDateRange(userId, "expense", from, to);
        return spent != null ? spent : BigDecimal.ZERO;
    }
}
