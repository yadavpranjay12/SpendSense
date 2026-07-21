package com.spendsense.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static Authentication getLoggedIn() {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
