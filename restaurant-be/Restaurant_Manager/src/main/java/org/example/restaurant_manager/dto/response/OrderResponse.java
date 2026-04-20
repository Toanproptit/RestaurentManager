package org.example.restaurant_manager.dto.response;

import java.util.Date;
import java.util.List;

import org.example.restaurant_manager.enums.OrderStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private Long totalAmount;
    private Date orderDate;
    private List<OrderDetailResponse> orderDetails;
    private DiningTableResponse diningTable;
    private UserResponse user;
}
