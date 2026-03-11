package org.example.restaurant_manager.dto.request;

import lombok.Data;

@Data
public class UpdateFoodRequest {
    private String name;
    private String description;
    private Double price;
    private String image;
}