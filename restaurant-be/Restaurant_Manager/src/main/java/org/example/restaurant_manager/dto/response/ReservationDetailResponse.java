package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationDetailResponse {
    private Long id;

    private Long reservationId;

    private Set<DiningTableResponse> diningTables;
}
