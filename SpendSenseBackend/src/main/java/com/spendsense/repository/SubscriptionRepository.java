package com.spendsense.repository;

import com.spendsense.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    // Used by the Cron Job to find subscriptions due today
    List<Subscription> findByNextBillingDate(LocalDate date);

    // Useful for fetching a specific user's subscriptions for the frontend UI
    List<Subscription> findByUserUsername(String username);
}