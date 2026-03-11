package org.example.restaurant_manager.dto.request;

import org.example.restaurant_manager.enums.Role;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateUserRequest {
    private String name;

    @Email(message = "Email invalid")
    private String email;

    private String password;

    private Role role;
}