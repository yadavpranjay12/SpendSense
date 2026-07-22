package com.spendsense.controller;

import com.spendsense.dto.ExpenseGroupRequestDto;
import com.spendsense.model.ExpenseGroup;
import com.spendsense.service.ExpenseGroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/expense-groups")
public class ExpenseGroupController {

    private final ExpenseGroupService expenseGroupService;

    public ExpenseGroupController(ExpenseGroupService expenseGroupService) {
        this.expenseGroupService = expenseGroupService;
    }

    @PostMapping
    public ResponseEntity<ExpenseGroup> createGroup(@RequestBody @Valid ExpenseGroupRequestDto request, Authentication authentication) {
        ExpenseGroup group = new ExpenseGroup();
        group.setName(request.getName());
        group.setDescription(request.getDescription());

        ExpenseGroup saved = expenseGroupService.addNew(group, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseGroup> updateGroup(@PathVariable UUID id, @RequestBody @Valid ExpenseGroupRequestDto request, Authentication authentication) {
        ExpenseGroup updated = expenseGroupService.update(id, request, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id, Authentication authentication) {
        expenseGroupService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ExpenseGroup>> getAllGroups(Authentication authentication) {
        List<ExpenseGroup> groups = expenseGroupService.getAll(0, 100, authentication.getName()).getContent();
        return ResponseEntity.ok(groups);
    }
}