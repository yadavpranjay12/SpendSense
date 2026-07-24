package com.spendsense.service;

import com.spendsense.model.Expense;
import com.spendsense.model.Subscription;
import com.spendsense.repository.SubscriptionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final ExpenseService expenseService;

    public SubscriptionService(SubscriptionRepository subscriptionRepository, ExpenseService expenseService) {
        this.subscriptionRepository = subscriptionRepository;
        this.expenseService = expenseService;
    }

    // Runs at 00:01 AM every day
    @Scheduled(cron = "0 1 0 * * ?")
    @Transactional
    public void processDueSubscriptions() {
        log.info("Starting daily subscription check...");
        LocalDate today = LocalDate.now();
        List<Subscription> dueSubscriptions = subscriptionRepository.findByNextBillingDate(today);

        for (Subscription sub : dueSubscriptions) {
            try {
                Expense newExpense = new Expense();
                newExpense.setAmount(sub.getAmount());
                newExpense.setDescription("AUTO-BILL: " + sub.getDescription());
                newExpense.setCreationTime(LocalDateTime.now());

                expenseService.addNew(newExpense, sub.getExpenseGroup().getId(), sub.getUser().getUsername());

                updateNextBillingDate(sub);
                subscriptionRepository.save(sub);
                log.info("Successfully processed subscription: {}", sub.getDescription());
            } catch (Exception e) {
                log.error("Failed to process subscription ID {}: {}", sub.getId(), e.getMessage());
            }
        }
    }

    private void updateNextBillingDate(Subscription sub) {
        if ("MONTHLY".equalsIgnoreCase(sub.getFrequency())) {
            sub.setNextBillingDate(sub.getNextBillingDate().plusMonths(1));
        } else if ("YEARLY".equalsIgnoreCase(sub.getFrequency())) {
            sub.setNextBillingDate(sub.getNextBillingDate().plusYears(1));
        }
    }
}