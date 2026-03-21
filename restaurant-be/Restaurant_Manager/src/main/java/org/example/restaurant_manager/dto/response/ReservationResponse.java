package org.example.restaurant_manager.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

import org.example.restaurant_manager.enums.ReservationStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationResponse {
    private Long id;
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private ReservationStatus status;
    private Long customerId;
}