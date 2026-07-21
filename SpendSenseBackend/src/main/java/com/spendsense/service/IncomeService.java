package com.spendsense.service;

import com.spendsense.dto.IncomeRequestDto;
import com.spendsense.exception.AccessResourceDeniedException;
import com.spendsense.exception.NotFoundException;
import com.spendsense.model.Income;
import com.spendsense.model.User;
import com.spendsense.repository.IncomeRepository;
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
public class IncomeService {

    private final IncomeRepository repository;
    private final IncomeGroupService incomeGroupService;
    private final UserService userService;

    public IncomeService(IncomeRepository repository, IncomeGroupService incomeGroupService, UserService userService) {
        this.repository = repository;
        this.incomeGroupService = incomeGroupService;
        this.userService = userService;
    }

    public Income addNew(Income income, UUID incomeGroupId, String username) throws NotFoundException {
        income.setIncomeGroup(incomeGroupService.getByIdAndUserUsername(incomeGroupId, username));
        income.setUser(userService.getByUsername(username));
        return repository.save(income);
    }

    public Page<Income> getAll(int pageNo, int size, String username) {
        User user = userService.getByUsername(username);
        return repository.findByUser(user, PageRequest.of(pageNo, size, Sort.by("creationTime").descending()));
    }

    public List<Income> getAll(String username) {
        User user = userService.getByUsername(username);
        return repository.findByUser(user);
    }

    public List<Income> getLastFew(int size, String username) {
        return repository.findByUserUsernameOrderByCreationTimeDesc(username, PageRequest.of(0, size));
    }

    public Income update(UUID id, IncomeRequestDto updateDto, String username) throws NotFoundException {
        Income income = getByIdAndUserUsername(id, username);
        income.setDescription(updateDto.getDescription());
        income.setAmount(updateDto.getAmount());
        income.setIncomeGroup(incomeGroupService.getByIdAndUserUsername(updateDto.getIncomeGroupId(), username));
        return repository.save(income);
    }

    public void deleteById(UUID id, String username) throws NotFoundException {
        Income income = getByIdAndUserUsername(id, username);
        repository.delete(income);
    }

    public List<Income> getByIncomeGroupId(UUID incomeGroupId, int size, String username) {
        incomeGroupService.getByIdAndUserUsername(incomeGroupId, username);
        return repository.findByIncomeGroupIdOrderByCreationTimeDesc(incomeGroupId, PageRequest.of(0, size));
    }

    public Income getByIdAndUserUsername(UUID id, String username) {
        User user = userService.getByUsername(username);
        repository.findById(id).orElseThrow(() -> new NotFoundException(Income.class.getSimpleName()));
        return repository.findByIdAndUser(id, user).orElseThrow(() -> new AccessResourceDeniedException(Income.class.getSimpleName()));
    }

    public List<Income> getIncomesForYesterday(String username) {
        LocalDateTime start = LocalDateTime.now().minusDays(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = LocalDateTime.now().minusDays(1).withHour(23).withMinute(59).withSecond(59);
        return repository.findByUserUsernameAndCreationTimeBetweenOrderByCreationTimeDesc(username, start, end);
    }
}