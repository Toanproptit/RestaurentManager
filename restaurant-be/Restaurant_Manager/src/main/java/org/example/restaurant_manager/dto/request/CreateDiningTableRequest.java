package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateDiningTableRequest {
    @NotBlank(message = "Table name cannot be blank")
    private String name;

    private String description;

    private int maxGuests;

    @NotNull(message = "Reservation detail is required")
    private Long reservationDetailId;

    @NotNull(message = "Order is required")
    private Long orderId;
}