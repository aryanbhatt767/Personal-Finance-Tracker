package com.fintrack.controller;

import com.fintrack.model.Budget;
import com.fintrack.model.User;
import com.fintrack.repository.UserRepository;
import com.fintrack.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    @Autowired private BudgetService budgetService;
    @Autowired private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping
    public ResponseEntity<List<Budget>> getAll(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String month) {
        Long userId = getUserId(userDetails);
        List<Budget> budgets = month != null
                ? budgetService.getByUserAndMonth(userId, month)
                : budgetService.getAllByUser(userId);
        return ResponseEntity.ok(budgets);
    }

    @PostMapping
    public ResponseEntity<Budget> createOrUpdate(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.createOrUpdate(budget, getUserId(userDetails)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.update(id, budget, getUserId(userDetails)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        budgetService.delete(id, getUserId(userDetails));
        return ResponseEntity.ok(Map.of("message", "Budget deleted"));
    }
}
