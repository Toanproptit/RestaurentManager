package org.example.restaurant_manager.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class UpdateReservationDetailRequest {
    private Long reservationId;
    private List<Long> diningTableIds;
}