package com.spendsense.repository;

import com.spendsense.model.Expense;
import com.spendsense.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    Page<Expense> findByUser(User user, Pageable pageable);
    List<Expense> findByUser(User user);
    Optional<Expense> findByIdAndUser(UUID id, User user);




    List<Expense> findByUserUsernameOrderByCreationTimeDesc(String username, Pageable pageable);


    List<Expense> findByExpenseGroupIdOrderByCreationTimeDesc(UUID expenseGroupId, Pageable pageable);

   List<Expense> findByUserUsernameAndCreationTimeBetweenOrderByCreationTimeDesc(String username, LocalDateTime start, LocalDateTime end);
}