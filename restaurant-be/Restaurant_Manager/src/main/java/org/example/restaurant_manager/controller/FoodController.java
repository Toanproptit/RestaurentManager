package org.example.restaurant_manager.controller;


import java.util.List;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.dto.response.TopSellingFoodResponse;
import org.example.restaurant_manager.entity.Food;
import org.example.restaurant_manager.service.FoodService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/foods")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public ApiResponse<List<FoodResponse>> getFoods(){
        return ApiResponse.<List<FoodResponse>>builder()
                .code(200)
                .message("success")
                .result(foodService.findAll())
                .build();
    }

    @GetMapping("/top-selling")
    public ApiResponse<List<TopSellingFoodResponse>> getTopSellingFoods() {
        return ApiResponse.<List<TopSellingFoodResponse>>builder()
                .code(200)
                .message("success")
                .result(foodService.getTopSellingFoods())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<FoodResponse> getFoodById(@PathVariable Long id){
        return ApiResponse.<FoodResponse>builder()
                .code(200)
                .message("success")
                .result(foodService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<FoodResponse> save(@RequestBody Food food){
        return ApiResponse.<FoodResponse>builder()
                .code(200)
                .message("success")
                .result(foodService.createFood(food))
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<FoodResponse> updateFood(@PathVariable Long id, @RequestBody Food food){
        return ApiResponse.<FoodResponse>builder()
                .code(200)
                .message("success")
                .result(foodService.updateFood(id, food))
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteFood(@PathVariable Long id){
        foodService.deleteFood(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Deleted success")
                .build();

    }
}
