package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.restaurant_manager.enums.OrderStatus;
import org.example.restaurant_manager.model.OrderDetail;

import java.util.List;

@Data
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private OrderStatus status;
    private Long totalAmount;
    private List<OrderDetailResponse> orderDetails;
}
