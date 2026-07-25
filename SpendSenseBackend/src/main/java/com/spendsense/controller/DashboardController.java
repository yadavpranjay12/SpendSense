package com.spendsense.controller;

import com.spendsense.model.User;
import com.spendsense.repository.ExpenseGroupRepository;
import com.spendsense.service.DashboardService;
import com.spendsense.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final ExpenseGroupRepository expenseGroupRepository;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService,
                               ExpenseGroupRepository expenseGroupRepository,
                               UserService userService) {
        this.dashboardService = dashboardService;
        this.expenseGroupRepository = expenseGroupRepository;
        this.userService = userService;
    }

    // --- 1. The Summary Endpoint (Fixes the 404 Error!) ---
    @GetMapping("/summary")
    public ResponseEntity<?> getDashboardSummary(Authentication authentication) {
        String username = authentication.getName();

        // We pack the 3 separate service calls into one neat JSON object for React
        Map<String, Object> summaryData = new HashMap<>();
        summaryData.put("totalBalance", dashboardService.getTotalAmount(username));
        summaryData.put("recentExpenses", dashboardService.getLastFewExpenses(5, username));
        summaryData.put("recentIncomes", dashboardService.getLastFewIncomes(5, username));

        return ResponseEntity.ok(summaryData);
    }

    // --- 2. The Budgets Endpoint (For your Progress Bars) ---
    @GetMapping("/budgets")
    public ResponseEntity<?> getBudgetProgress(Authentication authentication) {
        String username = authentication.getName();

        // Get the User UUID safely
        User user = userService.getByUsername(username);
        UUID userId = user.getId();

        LocalDate now = LocalDate.now();

        // Fetch the native PostgreSQL calculation
        List<Map<String, Object>> budgetReport = expenseGroupRepository
                .getBudgetReport(userId, now.getMonthValue(), now.getYear());

        return ResponseEntity.ok(budgetReport);
    }
}