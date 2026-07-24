package com.spendsense.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "subscriptions")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String description;
    private Double amount;

    @Column(name = "next_billing_date")
    private LocalDate nextBillingDate;
    private String frequency; // "MONTHLY", "YEARLY"

    @ManyToOne
    @JoinColumn(name = "expense_group_id")
    private ExpenseGroup expenseGroup;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Getters and Setters...
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
    public LocalDate getNextBillingDate() { return nextBillingDate; }
    public void setNextBillingDate(LocalDate nextBillingDate) { this.nextBillingDate = nextBillingDate; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public ExpenseGroup getExpenseGroup() { return expenseGroup; }
    public void setExpenseGroup(ExpenseGroup expenseGroup) { this.expenseGroup = expenseGroup; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}