package org.example.restaurant_manager.mapper;

import java.util.Set;
import java.util.stream.Collectors;

import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    private final OrderDetailMapper orderDetailMapper;
    private final DiningTableMapper diningTableMapper;

    public OrderMapper(OrderDetailMapper orderDetailMapper, DiningTableMapper diningTableMapper) {
        this.orderDetailMapper = orderDetailMapper;
        this.diningTableMapper = diningTableMapper;
    }

    public OrderResponse toOrderResponse(Order order){
        Set<DiningTableResponse> diningTables = order.getDiningTables().stream()
                .map(diningTableMapper::toDiningTableResponse)
                .collect(Collectors.toSet());

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getOrderDate(),
                order.getOrderDetails().stream()
                        .map(orderDetailMapper::toOrderDetailResponse)
                        .collect(Collectors.toList()),
                diningTables
        );
    }
}
