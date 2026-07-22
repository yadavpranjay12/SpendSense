package com.spendsense.controller;

import com.spendsense.dto.ExpenseRequestDto;
import com.spendsense.model.Expense;
import com.spendsense.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
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
    public ResponseEntity<Expense> createExpense(@RequestBody @Valid ExpenseRequestDto request, Authentication authentication) {
        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());

        Expense saved = expenseService.addNew(expense, request.getExpenseGroupId(), authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable UUID id, @RequestBody @Valid ExpenseRequestDto request, Authentication authentication) {
        Expense updated = expenseService.update(id, request, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable UUID id, Authentication authentication) {
        expenseService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpenseById(@PathVariable UUID id, Authentication authentication) {
        Expense expense = expenseService.getByIdAndUsername(id, authentication.getName());
        return ResponseEntity.ok(expense);
    }

    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses(Authentication authentication) {
        List<Expense> expenses = expenseService.getAll(authentication.getName());
        return ResponseEntity.ok(expenses);
    }
}