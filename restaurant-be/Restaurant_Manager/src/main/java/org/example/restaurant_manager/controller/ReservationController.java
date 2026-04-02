package org.example.restaurant_manager.controller;



import java.util.List;

import org.example.restaurant_manager.dto.request.CreateReservationRequest;
import org.example.restaurant_manager.dto.request.UpdateReservationRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.dto.response.ReservationResponse;
import org.example.restaurant_manager.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @GetMapping
    public ApiResponse<PageResponse<ReservationResponse>> getReservations(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<ReservationResponse>>builder()
                .code(200)
                .message("success")
                .result(reservationService.findAll(page,size))
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
    public ApiResponse<ReservationResponse> create(@RequestBody @Valid CreateReservationRequest reservation) {
        return ApiResponse.<ReservationResponse>builder()
                .code(200)
                .message("success")
                .result(reservationService.create(reservation))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ReservationResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateReservationRequest reservation
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