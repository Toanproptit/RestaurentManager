package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {


    @NotBlank
    private String fullName;

    @NotBlank
    private String username;

    @Size(min = 6)
    private String password;

    @Email
    private String email;
}
