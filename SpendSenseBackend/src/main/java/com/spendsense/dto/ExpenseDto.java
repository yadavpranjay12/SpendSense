package com.spendsense.dto;

import java.util.UUID; // <-- Import UUID

public class ExpenseDto {

    private Double amount;
    private String description;
    private UUID expenseGroupId; // <-- Change this from Long to UUID

    // --- Getters and Setters --- //

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getExpenseGroupId() { return expenseGroupId; } // <-- Update return type
    public void setExpenseGroupId(UUID expenseGroupId) { this.expenseGroupId = expenseGroupId; } // <-- Update parameter type
}