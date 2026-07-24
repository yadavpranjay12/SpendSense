package com.spendsense.controller;

import com.spendsense.dto.ExpenseRequestDto;
import com.spendsense.model.Expense;
import com.spendsense.service.ExpenseService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }


    @PostMapping
    public ResponseEntity<?> addExpense(@RequestBody ExpenseRequestDto dto, Authentication authentication) {
        try {
            // Map the incoming DTO to a new Expense entity
            Expense newExpense = new Expense();
            newExpense.setAmount(dto.getAmount());
            newExpense.setDescription(dto.getDescription());
            newExpense.setCreationTime(LocalDateTime.now()); // Set timestamp

            Expense created = expenseService.addNew(newExpense, dto.getExpenseGroupId(), authentication.getName());
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(Authentication authentication) {
        return ResponseEntity.ok(expenseService.getAll(authentication.getName()));
    }


    @GetMapping("/page")
    public ResponseEntity<Page<Expense>> getPaginatedExpenses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        return ResponseEntity.ok(expenseService.getAll(page, size, authentication.getName()));
    }


    @GetMapping("/recent")
    public ResponseEntity<List<Expense>> getRecentExpenses(
            @RequestParam(defaultValue = "5") int size,
            Authentication authentication) {
        return ResponseEntity.ok(expenseService.getLastFew(size, authentication.getName()));
    }

    @GetMapping("/yesterday")
    public ResponseEntity<List<Expense>> getYesterdayExpenses(Authentication authentication) {
        return ResponseEntity.ok(expenseService.getExpensesForYesterday(authentication.getName()));
    }


    @GetMapping("/group/{groupId}")
    public ResponseEntity<?> getExpensesByGroup(
            @PathVariable UUID groupId,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        try {
            List<Expense> expenses = expenseService.getByExpenseGroupId(groupId, size, authentication.getName());
            return ResponseEntity.ok(expenses);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExpense(
            @PathVariable UUID id,
            @RequestBody ExpenseRequestDto dto,
            Authentication authentication) {
        try {
            Expense updatedExpense = expenseService.update(id, dto, authentication.getName());
            return ResponseEntity.ok(updatedExpense);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExpense(@PathVariable UUID id, Authentication authentication) {
        try {
            expenseService.deleteById(id, authentication.getName());
            return ResponseEntity.ok("Expense deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}