package org.example.restaurant_manager.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReservationDetailRequest {
    @NotNull(message = "Reservation is required")
    private Long reservationId;
}