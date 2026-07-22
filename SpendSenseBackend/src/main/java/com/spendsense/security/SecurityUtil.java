package com.spendsense.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

public class SecurityUtil {

    public static Authentication getLoggedIn() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    // Added a helpful method to easily grab the username string for your services
    public static String getLoggedInUsername() {
        Authentication auth = getLoggedIn();
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            return ((UserDetails) auth.getPrincipal()).getUsername();
        }
        return null;
    }
}