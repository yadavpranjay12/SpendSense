package com.spendsense.controller;

import com.spendsense.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getDashboardSummary(Authentication authentication) {
        String username = authentication.getName();
        Map<String, Object> summary = new HashMap<>();

        // Call the 3 specific methods available in your DashboardService
        summary.put("totalBalance", dashboardService.getTotalAmount(username));
        summary.put("recentExpenses", dashboardService.getLastFewExpenses(5, username)); // Fetches last 5 expenses
        summary.put("recentIncomes", dashboardService.getLastFewIncomes(5, username));   // Fetches last 5 incomes

        return ResponseEntity.ok(summary);
    }
}