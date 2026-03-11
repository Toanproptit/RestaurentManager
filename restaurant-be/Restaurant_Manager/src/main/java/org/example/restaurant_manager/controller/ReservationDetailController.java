package org.example.restaurant_manager.controller;

import java.util.List;

import org.example.restaurant_manager.dto.request.CreateReservationDetailRequest;
import org.example.restaurant_manager.dto.request.UpdateReservationDetailRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.ReservationDetailResponse;
import org.example.restaurant_manager.service.ReservationDetailService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/reservation-details")
public class ReservationDetailController {

    private final ReservationDetailService reservationDetailService;

    public ReservationDetailController(ReservationDetailService reservationDetailService) {
        this.reservationDetailService = reservationDetailService;
    }

    @GetMapping
    public ApiResponse<List<ReservationDetailResponse>> getAll() {
        return ApiResponse.<List<ReservationDetailResponse>>builder()
                .code(200)
                .message("success")
                .result(reservationDetailService.findAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ReservationDetailResponse> getById(@PathVariable Long id) {
        return ApiResponse.<ReservationDetailResponse>builder()
                .code(200)
                .message("success")
                .result(reservationDetailService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<ReservationDetailResponse> create(@RequestBody @Valid CreateReservationDetailRequest detail) {
        return ApiResponse.<ReservationDetailResponse>builder()
                .code(200)
                .message("success")
                .result(reservationDetailService.create(detail))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ReservationDetailResponse> update(
            @PathVariable Long id,
            @RequestBody @Valid UpdateReservationDetailRequest detail
    ) {
        return ApiResponse.<ReservationDetailResponse>builder()
                .code(200)
                .message("success")
                .result(reservationDetailService.update(id, detail))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        reservationDetailService.deleteById(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Deleted success")
                .build();
    }
}