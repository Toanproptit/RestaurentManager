package org.example.restaurant_manager.repository;

import java.util.Optional;

import org.example.restaurant_manager.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail,Long> {
	Optional<OrderDetail> findByOrderIdAndFoodId(Long orderId, Long foodId);
	java.util.List<OrderDetail> findByOrderId(Long orderId);
}
