package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.ReservationDetailResponse;
import org.example.restaurant_manager.entity.ReservationDetail;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class ReservationDetailMapper {

    private final DiningTableMapper diningTableMapper;

    public ReservationDetailMapper(DiningTableMapper diningTableMapper) {
        this.diningTableMapper = diningTableMapper;
    }

    public ReservationDetailResponse toResponse(ReservationDetail reservationDetail) {

        ReservationDetailResponse response = new ReservationDetailResponse();

        response.setId(reservationDetail.getId());
        response.setReservationId(
                reservationDetail.getReservation().getId()
        );

        response.setDiningTables(
                reservationDetail.getDiningTables()
                        .stream()
                        .map(diningTableMapper::toDiningTableResponse)
                        .collect(Collectors.toSet())
        );

        return response;
    }
}
