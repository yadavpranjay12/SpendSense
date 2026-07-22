package com.spendsense.controller;

import com.spendsense.dto.IncomeGroupRequestDto;
import com.spendsense.model.IncomeGroup;
import com.spendsense.service.IncomeGroupService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/income-groups")
public class IncomeGroupController {

    private final IncomeGroupService incomeGroupService;

    public IncomeGroupController(IncomeGroupService incomeGroupService) {
        this.incomeGroupService = incomeGroupService;
    }

    @PostMapping
    public ResponseEntity<IncomeGroup> createGroup(@RequestBody @Valid IncomeGroupRequestDto request, Authentication authentication) {
        IncomeGroup group = new IncomeGroup();
        group.setName(request.getName());
        group.setDescription(request.getDescription());

        IncomeGroup saved = incomeGroupService.addNew(group, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<IncomeGroup> updateGroup(@PathVariable UUID id, @RequestBody @Valid IncomeGroupRequestDto request, Authentication authentication) {
        IncomeGroup updated = incomeGroupService.update(id, request, authentication.getName());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGroup(@PathVariable UUID id, Authentication authentication) {
        incomeGroupService.deleteById(id, authentication.getName());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<IncomeGroup>> getAllGroups(Authentication authentication) {
        List<IncomeGroup> groups = incomeGroupService.getAll(0, 100, authentication.getName()).getContent();        return ResponseEntity.ok(groups);
    }
}