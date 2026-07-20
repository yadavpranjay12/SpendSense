package com.spendsense.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import jakarta.validation.constraints.NotBlank;

@AllArgsConstructor
@Getter
public class IncomeGroupRequestDto {

    @NotBlank
    private String name;

    @NotBlank
    private String description;
}
