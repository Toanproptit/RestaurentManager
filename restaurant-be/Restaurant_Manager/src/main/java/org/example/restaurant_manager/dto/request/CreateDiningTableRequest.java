package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateDiningTableRequest {
    @NotBlank(message = "Table name cannot be blank")
    private String name;

    private String description;

    private int maxGuests;

    private Long reservationDetailId;

    private Long orderId;
}