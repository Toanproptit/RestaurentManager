package org.example.restaurant_manager.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FoodResponse {
    private Long id;
    private String name;
    private String description;
    private double price;
}
