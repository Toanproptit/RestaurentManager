package org.example.restaurant_manager.repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

import org.example.restaurant_manager.entity.OrderDetail;
import org.example.restaurant_manager.dto.response.OrderCountByFoodResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
	Optional<OrderDetail> findByOrderIdAndFoodId(Long orderId, Long foodId);
	java.util.List<OrderDetail> findByOrderId(Long orderId);

	@Query("SELECT new org.example.restaurant_manager.dto.response.OrderCountByFoodResponse(" +
	       "f.id, f.name, SUM(od.quantity)) " +
	       "FROM OrderDetail od " +
	       "JOIN od.food f " +
	       "JOIN od.order o " +
	       "WHERE CAST(o.OrderDate as date) = :date " +
	       "GROUP BY f.id, f.name " +
	       "ORDER BY SUM(od.quantity) DESC")
	List<OrderCountByFoodResponse> getOrderCountByFoodOnDate(@Param("date") LocalDate date);
}
