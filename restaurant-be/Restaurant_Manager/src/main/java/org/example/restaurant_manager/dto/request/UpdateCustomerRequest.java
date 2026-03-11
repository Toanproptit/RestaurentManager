package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class UpdateCustomerRequest {
    private String name;

    @Email(message = "Email invalid")
    private String email;

    private String phone;
    private String address;
}