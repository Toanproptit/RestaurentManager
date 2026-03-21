package org.example.restaurant_manager.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

import org.example.restaurant_manager.enums.ReservationStatus;

import lombok.Data;

@Data
public class UpdateReservationRequest {
    private LocalDate reservationDate;
    private LocalTime startTime;
    private LocalTime endTime;
    private Long customerId;
    private ReservationStatus status;
}