package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.entity.OrderDetail;
import org.springframework.stereotype.Component;


@Component
public class OrderDetailMapper {
    public OrderDetailResponse toOrderDetailResponse(OrderDetail orderDetail){
        return new OrderDetailResponse(orderDetail.getId(), orderDetail.getId(), orderDetail.getQuantity(), orderDetail.getPrice());
    }
}
