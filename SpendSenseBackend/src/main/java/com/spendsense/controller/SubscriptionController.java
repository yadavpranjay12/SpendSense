package com.spendsense.controller;

import com.spendsense.model.Subscription;
import com.spendsense.repository.SubscriptionRepository;
import com.spendsense.service.ExpenseGroupService;
import com.spendsense.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
public class SubscriptionController {

    private final SubscriptionRepository repo;
    private final ExpenseGroupService groupService;
    private final UserService userService;

    public SubscriptionController(SubscriptionRepository repo, ExpenseGroupService groupService, UserService userService) {
        this.repo = repo;
        this.groupService = groupService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<Subscription>> getMySubs(Authentication auth) {
        return ResponseEntity.ok(repo.findByUserUsername(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<?> addSub(@RequestBody Subscription sub, Authentication auth) {
        sub.setUser(userService.getByUsername(auth.getName()));
        sub.setExpenseGroup(groupService.getByIdAndUserUsername(sub.getExpenseGroup().getId(), auth.getName()));
        return ResponseEntity.ok(repo.save(sub));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSub(@PathVariable UUID id) {
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}