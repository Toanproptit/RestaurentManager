package org.example.restaurant_manager.service;

import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.mapper.FoodMapper;
import org.example.restaurant_manager.entity.Food;
import org.example.restaurant_manager.repository.FoodRepository;
import org.springframework.stereotype.Service;

import java.util.List;


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

    public FoodResponse findById(Long id){
        return foodRepository.findById(id).map(foodMapper::toFoodResponse).orElse(null);
    }

    public FoodResponse createFood(Food food) {
        Food saved =  foodRepository.save(food);
        return foodMapper.toFoodResponse(saved);
    }

    public FoodResponse updateFood(Long id ,Food newfood) {
        Food oldFood = getEntityById(id);
        oldFood.setName(newfood.getName());
        oldFood.setDescription(newfood.getDescription());
        oldFood.setPrice(newfood.getPrice());
        oldFood.setImage(newfood.getImage());
        return foodMapper.toFoodResponse(foodRepository.save(oldFood));
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }

    public Food getEntityById(Long id){
        return foodRepository.findById(id).orElse(null);
    }
}
