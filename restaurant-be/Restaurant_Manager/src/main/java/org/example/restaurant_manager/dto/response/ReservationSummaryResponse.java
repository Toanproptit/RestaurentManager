package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationSummaryResponse {
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
}