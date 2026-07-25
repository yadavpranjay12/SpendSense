package com.spendsense.controller;

import com.spendsense.dto.IncomeRequestDto;
import com.spendsense.model.Income;
import com.spendsense.service.IncomeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @GetMapping
    public ResponseEntity<List<Income>> getAllIncomes(Authentication authentication) {
        return ResponseEntity.ok(incomeService.getAll(authentication.getName()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateIncome(@PathVariable UUID id,
                                          @RequestBody IncomeRequestDto dto,
                                          Authentication authentication) {
        try {
            Income updatedIncome = incomeService.update(id, dto, authentication.getName());
            return ResponseEntity.ok(updatedIncome);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping
    public ResponseEntity<?> addIncome(@RequestBody IncomeRequestDto dto, Authentication authentication) {
        try {
            com.spendsense.model.Income newIncome = new com.spendsense.model.Income();
            newIncome.setAmount(dto.getAmount());
            newIncome.setDescription(dto.getDescription());
            newIncome.setCreationTime(java.time.LocalDateTime.now());

            com.spendsense.model.Income created = incomeService.addNew(newIncome, dto.getIncomeGroupId(), authentication.getName());
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteIncome(@PathVariable UUID id, Authentication authentication) {
        try {
            incomeService.deleteById(id, authentication.getName());
            return ResponseEntity.ok("Income deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}