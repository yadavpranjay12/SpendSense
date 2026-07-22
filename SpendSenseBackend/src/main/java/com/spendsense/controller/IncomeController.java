package com.spendsense.controller;

import com.spendsense.dto.IncomeRequestDto;
import com.spendsense.model.Income;
import com.spendsense.service.IncomeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/incomes")
public class IncomeController {

    private final IncomeService incomeService;

    public IncomeController(IncomeService incomeService) {
        this.incomeService = incomeService;
    }

    @PostMapping
    public ResponseEntity<Income> createIncome(@RequestBody @Valid IncomeRequestDto request, Authentication authentication) {
        Income income = new Income();
        income.setAmount(request.getAmount());
        income.setDescription(request.getDescription());

        Income saved = incomeService.addNew(income, request.getIncomeGroupId(), authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Income> updateIncome(@PathVariable UUID id, @RequestBody @Valid IncomeRequestDto request, Authentication authentication) {
        Income updated = incomeService.update(id, request, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIncome(@PathVariable UUID id, Authentication authentication) {
        incomeService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Income> getIncomeById(@PathVariable UUID id, Authentication authentication) {
        Income income = incomeService.getByIdAndUserUsername(id, authentication.getName());;
        return ResponseEntity.ok(income);
    }

    @GetMapping
    public ResponseEntity<List<Income>> getAllIncomes(Authentication authentication) {
        List<Income> incomes = incomeService.getAll(authentication.getName());
        return ResponseEntity.ok(incomes);
    }
}