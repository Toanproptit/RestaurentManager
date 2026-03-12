package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.entity.OrderDetail;
import org.springframework.stereotype.Component;


@Component
public class OrderDetailMapper {
    public OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail){
        Long orderId = orderDetail.getOrder() != null ? orderDetail.getOrder().getId() : null;
        Long foodId = orderDetail.getFood() != null ? orderDetail.getFood().getId() : null;

        return new OrderDetailResponse(orderId, foodId, orderDetail.getQuantity(), orderDetail.getPrice());
    }
}
