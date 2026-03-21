package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.ReservationResponse;
import org.example.restaurant_manager.entity.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationMapper {
    public ReservationResponse toReservationResponse(Reservation reservation){
        return new ReservationResponse(
                reservation.getId(),
                reservation.getReservationDate(),
                reservation.getStartTime(),
                reservation.getEndTime(),
                reservation.getStatus(),
                reservation.getCustomer() != null ? reservation.getCustomer().getId() : null
        );
    }

}