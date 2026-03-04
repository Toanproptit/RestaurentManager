package org.example.restaurant_manager.mapper;


import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.model.Food;
import org.springframework.stereotype.Component;

@Component
public class FoodMapper {
    public FoodResponse toFoodResponse(Food food){
        return new FoodResponse(food.getId(),food.getName(),food.getDescription(),food.getPrice());
    }
}
