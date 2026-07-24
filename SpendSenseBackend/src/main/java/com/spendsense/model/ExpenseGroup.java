package com.spendsense.model;

import lombok.*;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Getter
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ExpenseGroup {

    @Id
    @GeneratedValue
    private UUID id;

    @Setter
    private String name;

    @Setter
    private String description;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn
    @ToString.Exclude
    private User user;
    @Column(name = "budget_limit")
    private Double budgetLimit = 0.0; // Default to 0 (no limit)


    public ExpenseGroup(String name, String description) {
        this.name = name;
        this.description = description;
    }
}
