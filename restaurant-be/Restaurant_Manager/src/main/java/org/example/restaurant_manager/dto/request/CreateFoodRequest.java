package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateFoodRequest {
    @NotBlank(message = "Food name cannot be blank")
    private String name;

    private String description;

    @NotNull(message = "Food price is required")
    private Double price;

    private String image;
}