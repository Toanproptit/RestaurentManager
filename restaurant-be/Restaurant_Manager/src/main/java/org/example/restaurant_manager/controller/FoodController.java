package org.example.restaurant_manager.controller;


import java.util.List;

import org.example.restaurant_manager.dto.request.CreateFoodRequest;
import org.example.restaurant_manager.dto.request.UpdateFoodRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.dto.response.TopSellingFoodResponse;
import org.example.restaurant_manager.service.FoodService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/foods")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public ApiResponse<PageResponse<FoodResponse>> getFoods(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ){
        return ApiResponse.<PageResponse<FoodResponse>>builder()
                .code(200)
                .message("success")
                .result(foodService.findAll(page,size))
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
    public ApiResponse<FoodResponse> save(@RequestBody @Valid CreateFoodRequest food){
        return ApiResponse.<FoodResponse>builder()
                .code(200)
                .message("success")
                .result(foodService.createFood(food))
                .build();
    }
    @PutMapping("/{id}")
    public ApiResponse<FoodResponse> updateFood(@PathVariable Long id, @RequestBody @Valid UpdateFoodRequest food){
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
