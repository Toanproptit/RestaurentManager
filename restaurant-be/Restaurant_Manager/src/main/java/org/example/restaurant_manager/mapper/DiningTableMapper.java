package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.entity.DiningTable;
import org.springframework.stereotype.Component;

@Component
public class DiningTableMapper {
    public DiningTableResponse toDiningTableResponse(DiningTable diningTable){
    Long reservationDetailId = diningTable.getReservationDetail() != null
        ? diningTable.getReservationDetail().getId()
        : null;
    Long orderId = diningTable.getOrder() != null
        ? diningTable.getOrder().getId()
        : null;

    return new DiningTableResponse(
        diningTable.getId(),
        diningTable.getName(),
        diningTable.getDescription(),
        diningTable.getMaxGuests(),
        reservationDetailId,
        orderId
    );
    }
}
