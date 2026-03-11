package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCustomerRequest {
    @NotBlank(message = "Customer name cannot be blank")
    private String name;

    @Email(message = "Email invalid")
    private String email;

    private String phone;
    private String address;
}