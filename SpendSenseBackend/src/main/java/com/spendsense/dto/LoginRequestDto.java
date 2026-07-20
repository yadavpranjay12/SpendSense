package com.spendsense.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import jakarta.validation.constraints.NotBlank;

@AllArgsConstructor
@Getter
public class LoginRequestDto {

    @NotBlank
    private String username;

    @NotBlank
    private String password;
}
