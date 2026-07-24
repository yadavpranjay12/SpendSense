package com.spendsense.repository;

import com.spendsense.model.ExpenseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpenseGroupRepository extends JpaRepository<ExpenseGroup, UUID> {

    Optional<ExpenseGroup> findByIdAndUserUsername(UUID id, String username);

    List<ExpenseGroup> findByUserUsername(String username);

    // Optimized Native SQL Query to calculate Budget progress
    @Query(value = "SELECT eg.id as \"groupId\", eg.name as \"groupName\", eg.budget_limit as \"limit\", " +
            "COALESCE(SUM(e.amount), 0) as \"spent\" " +
            "FROM expense_group eg " +
            "LEFT JOIN expense e ON eg.id = e.expense_group_id " +
            "AND EXTRACT(MONTH FROM e.creation_time) = :month " +
            "AND EXTRACT(YEAR FROM e.creation_time) = :year " +
            "WHERE eg.user_id = :userId " +
            "GROUP BY eg.id, eg.name, eg.budget_limit",
            nativeQuery = true)
    List<Map<String, Object>> getBudgetReport(@Param("userId") UUID userId,
                                              @Param("month") int month,
                                              @Param("year") int year);
}