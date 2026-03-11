package org.example.restaurant_manager.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiningTableResponse {
    private Long id;
    private String name;
    private String description;
    private int maxGuests;
    private Long reservationDetailId;
    private Long orderId;
}
