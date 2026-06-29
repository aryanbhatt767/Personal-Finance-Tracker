package com.fintrack.repository;

import com.fintrack.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUserIdOrderByDateDesc(Long userId);

    List<Transaction> findByUserIdAndTypeOrderByDateDesc(Long userId, String type);

    List<Transaction> findByUserIdAndCategoryOrderByDateDesc(Long userId, String category);

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    List<Transaction> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate from, LocalDate to);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumByUserIdAndType(@Param("userId") Long userId, @Param("type") String type);

    @Query("SELECT SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND t.date BETWEEN :from AND :to")
    BigDecimal sumByUserIdAndTypeAndDateRange(
        @Param("userId") Long userId,
        @Param("type") String type,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );

    @Query("SELECT t.category, SUM(t.amount) FROM Transaction t WHERE t.user.id = :userId AND t.type = 'expense' GROUP BY t.category ORDER BY SUM(t.amount) DESC")
    List<Object[]> findCategoryBreakdownByUserId(@Param("userId") Long userId);

    @Query("SELECT FUNCTION('YEAR', t.date), FUNCTION('MONTH', t.date), t.type, SUM(t.amount) " +
           "FROM Transaction t WHERE t.user.id = :userId " +
           "GROUP BY FUNCTION('YEAR', t.date), FUNCTION('MONTH', t.date), t.type " +
           "ORDER BY FUNCTION('YEAR', t.date), FUNCTION('MONTH', t.date)")
    List<Object[]> findMonthlyTrendByUserId(@Param("userId") Long userId);

    long countByUserId(Long userId);
}
