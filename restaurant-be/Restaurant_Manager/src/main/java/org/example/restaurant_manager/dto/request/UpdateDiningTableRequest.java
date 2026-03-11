package org.example.restaurant_manager.dto.request;

import lombok.Data;

@Data
public class UpdateDiningTableRequest {
    private String name;
    private String description;
    private Integer maxGuests;
    private Long reservationDetailId;
    private Long orderId;
}