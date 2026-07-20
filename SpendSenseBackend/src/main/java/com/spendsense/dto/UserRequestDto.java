package com.spendsense.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import jakarta.validation.constraints.NotBlank;

@AllArgsConstructor
@Getter
public class UserRequestDto {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
