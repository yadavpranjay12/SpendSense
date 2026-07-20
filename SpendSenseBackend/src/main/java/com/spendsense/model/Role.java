package com.spendsense.model;
import jakarta.persistence.Entity;
import org.springframework.security.core.GrantedAuthority;

import jakarta.persistence.*;
@Entity
@Table(name="ROLE")
public class Role implements GrantedAuthority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Override
    public String getAuthority() {
        return name;
    }
}
