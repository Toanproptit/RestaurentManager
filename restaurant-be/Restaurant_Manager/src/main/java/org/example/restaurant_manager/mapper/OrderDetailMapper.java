package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.FoodResponse;
import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.entity.OrderDetail;
import org.springframework.stereotype.Component;


@Component
public class OrderDetailMapper {
    private final FoodMapper foodMapper;

    public OrderDetailMapper(FoodMapper foodMapper) {
        this.foodMapper = foodMapper;
    }

    public OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail){
        Long orderId = orderDetail.getOrder() != null ? orderDetail.getOrder().getId() : null;
        FoodResponse food = orderDetail.getFood() != null ? foodMapper.toFoodResponse(orderDetail.getFood()) : null;

        return new OrderDetailResponse(
                orderDetail.getId(),
                orderId,
                food,
                orderDetail.getQuantity(),
                orderDetail.getPrice()
        );
    }
}
