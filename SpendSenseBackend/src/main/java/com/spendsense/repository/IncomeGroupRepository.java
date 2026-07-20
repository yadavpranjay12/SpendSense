package com.spendsense.repository;

import com.spendsense.model.IncomeGroup;
import com.spendsense.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface IncomeGroupRepository extends JpaRepository<IncomeGroup, UUID> {

    Optional<IncomeGroup> findByNameAndUser(String name, User user);

    Page<IncomeGroup> findByUser(User user, PageRequest of);

    Optional<IncomeGroup> findByIdAndUser(UUID incomeGroupId, User user);
}
