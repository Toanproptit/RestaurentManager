package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.model.Order;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class OrderMapper {

    private final OrderDetailMapper orderDetailMapper;

    public OrderMapper(OrderDetailMapper orderDetailMapper) {
        this.orderDetailMapper = orderDetailMapper;
    }

    public OrderResponse toOrderResponse(Order order){
        return new OrderResponse(order.getId(),order.getStatus(),order.getTotalAmount(),order.getOrderDetails().stream()
                .map(orderDetailMapper::toOrderDetailResponse).collect(Collectors.toList()));
    }
}
