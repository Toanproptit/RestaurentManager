package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.ReservationSummaryResponse;
import org.example.restaurant_manager.model.Reservation;
import org.springframework.stereotype.Component;

@Component
public class ReservationSummaryMapper {
    public ReservationSummaryResponse reservationSummeryResponse(Reservation reservation){
        return new ReservationSummaryResponse(reservation.getReservationDate(),reservation.getStartTime(),reservation
                .getEndTime());
    }
}

