package com.spendsense.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;
@Getter
@Setter
public class IncomeRequestDto {
    private Double amount;
    private String description;
    private UUID incomeGroupId; // Secure UUID

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public UUID getIncomeGroupId() { return incomeGroupId; }
    public void setIncomeGroupId(UUID incomeGroupId) { this.incomeGroupId = incomeGroupId; }
}