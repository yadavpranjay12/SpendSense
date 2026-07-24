package com.spendsense.controller;

import com.spendsense.model.User;
import com.spendsense.repository.ExpenseGroupRepository;

import com.spendsense.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final ExpenseGroupRepository expenseGroupRepository;
private final UserService userService;
    public DashboardController(ExpenseGroupRepository expenseGroupRepository, UserService userService) {
        this.expenseGroupRepository = expenseGroupRepository;
        this.userService = userService;
    }
    @GetMapping("/budgets")
    public ResponseEntity<?> getBudgetProgress(Authentication authentication) {
        // 1. Get the username from the security context
        String username = authentication.getName();

        // 2. Look up the user ID using your UserService or UserRepository
        User user = userService.getByUsername(username);
        UUID userId = user.getId();

        LocalDate now = LocalDate.now();
        List<Map<String, Object>> budgetReport = expenseGroupRepository
                .getBudgetReport(userId, now.getMonthValue(), now.getYear());

        return ResponseEntity.ok(budgetReport);
    }
}