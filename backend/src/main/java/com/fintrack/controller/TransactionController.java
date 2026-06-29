package com.fintrack.controller;

import com.fintrack.model.Transaction;
import com.fintrack.model.User;
import com.fintrack.repository.UserRepository;
import com.fintrack.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    @Autowired private TransactionService transactionService;
    @Autowired private UserRepository userRepository;

    private Long getUserId(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .map(User::getId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Map<String, Object> toMap(Transaction t) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", t.getId());
        map.put("name", t.getName());
        map.put("amount", t.getAmount());
        map.put("type", t.getType());
        map.put("category", t.getCategory());
        map.put("icon", t.getIcon());
        map.put("color", t.getColor());
        map.put("date", t.getDate() != null ? t.getDate().toString() : null);
        map.put("notes", t.getNotes());
        map.put("createdAt", t.getCreatedAt() != null ? t.getCreatedAt().toString() : null);
        return map;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAll(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        Long userId = getUserId(userDetails);
        List<Transaction> txns;
        if (from != null && to != null)
            txns = transactionService.getByUserAndDateRange(userId, from, to);
        else if (type != null)
            txns = transactionService.getByUserAndType(userId, type);
        else
            txns = transactionService.getAllByUser(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Transaction t : txns) result.add(toMap(t));
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(toMap(transactionService.getById(id, getUserId(userDetails))));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Transaction transaction) {
        Transaction saved = transactionService.create(transaction, getUserId(userDetails));
        return ResponseEntity.ok(toMap(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody Transaction transaction) {
        Transaction updated = transactionService.update(id, transaction, getUserId(userDetails));
        return ResponseEntity.ok(toMap(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        transactionService.delete(id, getUserId(userDetails));
        return ResponseEntity.ok(Map.of("message", "Transaction deleted"));
    }
}