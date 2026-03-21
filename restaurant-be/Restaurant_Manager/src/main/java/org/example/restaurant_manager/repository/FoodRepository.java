package org.example.restaurant_manager.repository;

import java.util.List;

import org.example.restaurant_manager.dto.response.TopSellingFoodResponse;
import org.example.restaurant_manager.entity.Food;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface FoodRepository extends JpaRepository<Food,Long> {
	Page<Food> findByNameContainingIgnoreCase(String name, Pageable pageable);

	@Query("SELECT new org.example.restaurant_manager.dto.response.TopSellingFoodResponse(" +
			"f.id, f.name, SUM(od.quantity), SUM(od.quantity * od.price)) " +
			"FROM Food f " +
			"JOIN f.orderDetails od " +
			"GROUP BY f.id, f.name " +
			"ORDER BY SUM(od.quantity) DESC, f.name ASC")
	List<TopSellingFoodResponse> findTopSellingFoods(Pageable pageable);
}
