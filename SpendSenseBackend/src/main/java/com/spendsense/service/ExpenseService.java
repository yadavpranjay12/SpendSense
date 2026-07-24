package com.spendsense.service;

import com.spendsense.dto.ExpenseRequestDto;
import com.spendsense.exception.AccessResourceDeniedException;
import com.spendsense.exception.NotFoundException;
import com.spendsense.model.Expense;
import com.spendsense.model.User;
import com.spendsense.repository.ExpenseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class ExpenseService {

    private final ExpenseRepository repository;
    private final ExpenseGroupService expenseGroupService;
    private final UserService userService;

    public ExpenseService(ExpenseRepository repository, ExpenseGroupService expenseGroupService, UserService userService) {
        this.repository = repository;
        this.expenseGroupService = expenseGroupService;
        this.userService = userService;
    }

    public Expense addNew(Expense expense, UUID expenseGroupId, String username) throws NotFoundException {
        expense.setExpenseGroup(expenseGroupService.getByIdAndUserUsername(expenseGroupId, username));
        expense.setUser(userService.getByUsername(username));
        return repository.save(expense);
    }

    public Page<Expense> getAll(int pageNo, int size, String username) {
        User user = userService.getByUsername(username);
        return repository.findByUser(user, PageRequest.of(pageNo, size, Sort.by("creationTime").descending()));
    }

    public List<Expense> getAll(String username) {
        User user = userService.getByUsername(username);
        return repository.findByUser(user);
    }

    public List<Expense> getLastFew(int size, String username) {
        return repository.findByUserUsernameOrderByCreationTimeDesc(username, PageRequest.of(0, size));
    }

    public Expense update(UUID id, ExpenseRequestDto updateDto, String username) throws NotFoundException {
        Expense expense = getByIdAndUsername(id, username);
        expense.setDescription(updateDto.getDescription());
        expense.setAmount(updateDto.getAmount());

        // Only update the group if it actually changed to save a database call
        if (!expense.getExpenseGroup().getId().equals(updateDto.getExpenseGroupId())) {
            expense.setExpenseGroup(expenseGroupService.getByIdAndUserUsername(updateDto.getExpenseGroupId(), username));
        }

        return repository.save(expense);
    }

    public void deleteById(UUID id, String username) throws NotFoundException {
        Expense expense = getByIdAndUsername(id, username);
        repository.delete(expense);
    }

    public List<Expense> getByExpenseGroupId(UUID expenseGroupId, int size, String username) {
        // Validates ownership before fetching
        expenseGroupService.getByIdAndUserUsername(expenseGroupId, username);
        return repository.findByExpenseGroupIdOrderByCreationTimeDesc(expenseGroupId, PageRequest.of(0, size));
    }

    public Expense getByIdAndUsername(UUID id, String username) {
        User user = userService.getByUsername(username);

        // Ensure it exists first
        repository.findById(id).orElseThrow(() -> new NotFoundException(Expense.class.getSimpleName()));

        // Ensure the logged-in user owns it
        return repository.findByIdAndUser(id, user)
                .orElseThrow(() -> new AccessResourceDeniedException(Expense.class.getSimpleName()));
    }

    public List<Expense> getExpensesForYesterday(String username) {
        LocalDateTime start = LocalDateTime.now().minusDays(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = LocalDateTime.now().minusDays(1).withHour(23).withMinute(59).withSecond(59);
        return repository.findByUserUsernameAndCreationTimeBetweenOrderByCreationTimeDesc(username, start, end);
    }
}