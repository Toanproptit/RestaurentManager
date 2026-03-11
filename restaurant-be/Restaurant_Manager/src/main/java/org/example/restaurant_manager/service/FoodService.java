package org.example.restaurant_manager.service;

import java.util.List;

import org.example.restaurant_manager.dto.request.CreateFoodRequest;
import org.example.restaurant_manager.dto.request.UpdateFoodRequest;
import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.dto.response.TopSellingFoodResponse;
import org.example.restaurant_manager.entity.Food;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.FoodMapper;
import org.example.restaurant_manager.repository.FoodRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;


@Service
public class FoodService {
    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;

    public FoodService(FoodRepository foodRepository, FoodMapper foodMapper) {
        this.foodRepository = foodRepository;
        this.foodMapper = foodMapper;
    }

    public List<FoodResponse> findAll(){
        return foodRepository.findAll().stream().map(foodMapper::toFoodResponse).toList();
    }

    public List<TopSellingFoodResponse> getTopSellingFoods() {
        return foodRepository.findTopSellingFoods(PageRequest.of(0, 5));
    }

    public FoodResponse findById(Long id){
        return foodMapper.toFoodResponse(getEntityById(id));
    }

    public FoodResponse createFood(CreateFoodRequest request) {
        Food food = new Food();
        food.setName(request.getName());
        food.setDescription(request.getDescription());
        food.setPrice(request.getPrice());
        food.setImage(request.getImage());

        Food saved =  foodRepository.save(food);
        return foodMapper.toFoodResponse(saved);
    }

    public FoodResponse updateFood(Long id , UpdateFoodRequest newfood) {
        Food oldFood = getEntityById(id);
        if (newfood.getName() != null) {
            oldFood.setName(newfood.getName());
        }
        if (newfood.getDescription() != null) {
            oldFood.setDescription(newfood.getDescription());
        }
        if (newfood.getPrice() != null) {
            oldFood.setPrice(newfood.getPrice());
        }
        if (newfood.getImage() != null) {
            oldFood.setImage(newfood.getImage());
        }
        return foodMapper.toFoodResponse(foodRepository.save(oldFood));
    }

    public void deleteFood(Long id) {
        foodRepository.delete(getEntityById(id));
    }

    public Food getEntityById(Long id){
        return foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
    }
}
