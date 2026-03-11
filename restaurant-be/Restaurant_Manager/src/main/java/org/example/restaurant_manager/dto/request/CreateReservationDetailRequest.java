package org.example.restaurant_manager.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReservationDetailRequest {
    @NotNull(message = "Reservation is required")
    private Long reservationId;

    private List<Long> diningTableIds;
}