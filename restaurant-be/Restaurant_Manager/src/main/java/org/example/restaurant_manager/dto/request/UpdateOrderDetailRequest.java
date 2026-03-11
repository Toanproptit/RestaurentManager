package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateOrderDetailRequest {
    @NotNull(message = "Quantity is required")
    private Long quantity;
}