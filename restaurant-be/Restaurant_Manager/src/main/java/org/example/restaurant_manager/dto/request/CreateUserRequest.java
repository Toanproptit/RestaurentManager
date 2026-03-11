package org.example.restaurant_manager.dto.request;

import org.example.restaurant_manager.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateUserRequest {
    @NotBlank(message = "Username cannot be blank")
    private String name;

    @Email(message = "Email invalid")
    @NotBlank(message = "Email invalid")
    private String email;

    @NotBlank(message = "Password cannot be blank")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private Role role;
}