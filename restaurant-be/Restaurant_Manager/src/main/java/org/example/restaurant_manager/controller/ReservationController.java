package org.example.restaurant_manager.controller;



import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.ReservationResponse;
import org.example.restaurant_manager.model.Reservation;
import org.example.restaurant_manager.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ApiResponse<List<ReservationResponse>> getReservations() {
        return ApiResponse.<List<ReservationResponse>>builder()
                .code(200)
                .message("success")
                .result(reservationService.findAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ReservationResponse> getReservationById(@PathVariable Long id) {
        return ApiResponse.<ReservationResponse>builder()
                .code(200)
                .message("success")
                .result(reservationService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<ReservationResponse> create(@RequestBody Reservation reservation) {
        return ApiResponse.<ReservationResponse>builder()
                .code(200)
                .message("success")
                .result(reservationService.create(reservation))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ReservationResponse> update(
            @PathVariable Long id,
            @RequestBody Reservation reservation
    ) {
        return ApiResponse.<ReservationResponse>builder()
                .code(200)
                .message("success")
                .result(reservationService.update(id, reservation))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        reservationService.deleteById(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Deleted success")
                .build();
    }
}