package org.example.restaurant_manager.controller;


import java.util.List;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.dto.response.TopSellingFoodResponse;
import org.example.restaurant_manager.service.FoodService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/foods")
public class FoodController {
    private final FoodService foodService;

    public FoodController(FoodService foodService) {
        this.foodService = foodService;
    }

    @GetMapping
    public ApiResponse<PageResponse<FoodResponse>> getFoods(
            @RequestParam( defaultValue = "0") int page,
            @RequestParam( defaultValue = "10") int size
    ){
        return ApiResponse.<PageResponse<FoodResponse>>builder()
                .code(200)
                .message("success")
                .result(foodService.findAll(page,size))
                .build();
    }

    @GetMapping("/search")
    public ApiResponse<PageResponse<FoodResponse>> searchFoodsByName(
            @RequestParam String name,
            @RequestParam( defaultValue = "0") int page,
            @RequestParam( defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<FoodResponse>>builder()
                .code(200)
                .message("success")
                .result(foodService.searchByName(name, page, size))
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

    @PostMapping(consumes = "multipart/form-data")
    public ApiResponse<FoodResponse> save(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") Double price,
            @RequestPart(value = "image", required = false) MultipartFile image
    ){
        return ApiResponse.<FoodResponse>builder()
                .code(200)
                .message("success")
                .result(foodService.createFood(name, description, price, image))
                .build();
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ApiResponse<FoodResponse> updateFood(
            @PathVariable Long id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "price", required = false) Double price,
            @RequestPart(value = "image", required = false) MultipartFile image
    ){
        return ApiResponse.<FoodResponse>builder()
                .code(200)
                .message("success")
                .result(foodService.updateFood(id, name, description, price, image))
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
