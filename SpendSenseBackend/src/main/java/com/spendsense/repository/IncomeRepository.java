package com.spendsense.repository;

import com.spendsense.model.Income;
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
public interface IncomeRepository extends JpaRepository<Income, UUID> {
    Page<Income> findByUser(User user, Pageable pageable);
    List<Income> findByUser(User user);
    List<Income> findByUserUsernameOrderByCreationTimeDesc(String username, Pageable pageable);
    Optional<Income> findByIdAndUser(UUID id, User user);
    List<Income> findByUserUsernameAndCreationTimeBetweenOrderByCreationTimeDesc(String username, LocalDateTime start, LocalDateTime end);
    List<Income> findByIncomeGroupIdOrderByCreationTimeDesc(UUID incomeGroupId, Pageable pageable);
}