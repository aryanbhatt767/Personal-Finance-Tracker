package com.fintrack.controller;

import com.fintrack.model.User;
import com.fintrack.repository.UserRepository;
import com.fintrack.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired private TransactionService transactionService;
    @Autowired private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        BigDecimal income = transactionService.getTotalByType(userId, "income");
        BigDecimal expense = transactionService.getTotalByType(userId, "expense");
        BigDecimal balance = income.subtract(expense);
        double savingsRate = income.compareTo(BigDecimal.ZERO) > 0
                ? balance.divide(income, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0;

        return ResponseEntity.ok(Map.of(
                "totalIncome", income,
                "totalExpense", expense,
                "balance", balance,
                "savingsRate", Math.round(savingsRate * 10.0) / 10.0,
                "transactionCount", transactionService.countByUser(userId)
        ));
    }

    @GetMapping("/categories")
    public ResponseEntity<?> getCategoryBreakdown(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<Object[]> raw = transactionService.getCategoryBreakdown(userId);
        BigDecimal totalExpense = transactionService.getTotalByType(userId, "expense");

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : raw) {
            String category = (String) row[0];
            BigDecimal amount = (BigDecimal) row[1];
            double pct = totalExpense.compareTo(BigDecimal.ZERO) > 0
                    ? amount.divide(totalExpense, 4, RoundingMode.HALF_UP).doubleValue() * 100 : 0;
            result.add(Map.of(
                    "category", category,
                    "amount", amount,
                    "percentage", Math.round(pct * 10.0) / 10.0
            ));
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyTrend(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        List<Object[]> raw = transactionService.getMonthlyTrend(userId);

        Map<String, Map<String, Object>> monthMap = new LinkedHashMap<>();
        for (Object[] row : raw) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            String key = String.format("%d-%02d", year, month);
            String type = (String) row[2];
            BigDecimal amount = (BigDecimal) row[3];

            monthMap.computeIfAbsent(key, k -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("month", k);
                m.put("income", BigDecimal.ZERO);
                m.put("expense", BigDecimal.ZERO);
                return m;
            }).put(type, amount);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> entry : monthMap.values()) {
            BigDecimal inc = (BigDecimal) entry.getOrDefault("income", BigDecimal.ZERO);
            BigDecimal exp = (BigDecimal) entry.getOrDefault("expense", BigDecimal.ZERO);
            entry.put("balance", inc.subtract(exp));
            result.add(entry);
        }
        return ResponseEntity.ok(result);
    }
}
