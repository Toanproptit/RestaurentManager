package org.example.restaurant_manager.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.dto.response.TopSellingFoodResponse;
import org.example.restaurant_manager.entity.Food;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.FoodMapper;
import org.example.restaurant_manager.repository.FoodRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class FoodService {
    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;

    private static final String UPLOAD_DIR = "uploads/foods";

    public FoodService(FoodRepository foodRepository, FoodMapper foodMapper) {
        this.foodRepository = foodRepository;
        this.foodMapper = foodMapper;
    }

    public PageResponse<FoodResponse> findAll(int page, int size) {
        int ValidatedPage = page;
        int ValidatedSize = size;

        Page<Food> foodPage = foodRepository.findAll(
                PageRequest.of(ValidatedPage, ValidatedSize, Sort.by("name").descending())
        );

        return toPageResponse(foodPage, page, size);
        }

        public PageResponse<FoodResponse> searchByName(String name, int page, int size) {
        int validatedPage = page;
        int validatedSize = size;
        String keyword = name == null ? "" : name.trim();

        Page<Food> foodPage = foodRepository.findByNameContainingIgnoreCase(
            keyword,
            PageRequest.of(validatedPage, validatedSize, Sort.by("name").descending())
        );

        return toPageResponse(foodPage, page, size);
        }

        private PageResponse<FoodResponse> toPageResponse(Page<Food> foodPage, int page, int size) {

        List<FoodResponse> foods =
                foodPage.getContent()
                        .stream()
                        .map(foodMapper :: toFoodResponse)
                        .toList();

        return PageResponse.<FoodResponse>builder()
                .content(foods)
                .page(page)
                .size(size)
                .totalElements(foodPage.getTotalElements())
                .totalPages(foodPage.getTotalPages())
                .first(foodPage.isFirst())
                .last(foodPage.isLast())
                .build();
    }

    public List<TopSellingFoodResponse> getTopSellingFoods() {
        return foodRepository.findTopSellingFoods(PageRequest.of(0, 5));
    }

    public FoodResponse findById(Long id){
        return foodMapper.toFoodResponse(getEntityById(id));
    }

    public FoodResponse createFood(String name, String description, Double price, MultipartFile imageFile) {
        Food food = new Food();
        food.setName(name);
        food.setDescription(description);
        food.setPrice(price);

        if (imageFile != null && !imageFile.isEmpty()) {
            String imageUrl = saveImage(imageFile);
            food.setImage(imageUrl);
        }

        Food saved = foodRepository.save(food);
        return foodMapper.toFoodResponse(saved);
    }

    public FoodResponse updateFood(Long id, String name, String description, Double price, MultipartFile imageFile) {
        Food oldFood = getEntityById(id);

        if (name != null) {
            oldFood.setName(name);
        }
        if (description != null) {
            oldFood.setDescription(description);
        }
        if (price != null) {
            oldFood.setPrice(price);
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            // Delete old image file if exists
            deleteImageFile(oldFood.getImage());
            // Save new image
            String imageUrl = saveImage(imageFile);
            oldFood.setImage(imageUrl);
        }

        return foodMapper.toFoodResponse(foodRepository.save(oldFood));
    }

    public void deleteFood(Long id) {
        Food food = getEntityById(id);
        // Delete image file from disk
        deleteImageFile(food.getImage());
        foodRepository.delete(food);
    }

    public Food getEntityById(Long id){
        return foodRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
    }

    /**
     * Save uploaded image to disk, return the URL path (e.g. /uploads/foods/uuid.jpg)
     */
    private String saveImage(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "/" + UPLOAD_DIR + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }

    /**
     * Delete image file from disk if it exists
     */
    private void deleteImageFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return;
        try {
            // imageUrl is like /uploads/foods/uuid.jpg -> remove leading /
            String relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
            Path filePath = Paths.get(relativePath);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log but don't throw - image deletion failure shouldn't block the operation
            System.err.println("Failed to delete image file: " + imageUrl + " - " + e.getMessage());
        }
    }
}
