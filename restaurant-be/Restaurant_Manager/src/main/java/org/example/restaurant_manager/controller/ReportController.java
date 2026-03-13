package org.example.restaurant_manager.controller;


import lombok.RequiredArgsConstructor;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.RevenueStatisticsResponse;
import org.example.restaurant_manager.service.InvoiceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    public final InvoiceService invoiceService;

    @GetMapping("/revenue/daily")
    public ApiResponse<List<RevenueStatisticsResponse>> getRevenueByDay() {
        return ApiResponse.<List<RevenueStatisticsResponse>>builder()
                .code(200)
                .message("success")
                .result(invoiceService.getRevenueByDay())
                .build();
    }

    @GetMapping("/revenue/monthly")
    public ApiResponse<List<RevenueStatisticsResponse>> getRevenueByMonth() {
        return ApiResponse.<List<RevenueStatisticsResponse>>builder()
                .code(200)
                .message("success")
                .result(invoiceService.getRevenueByMonth())
                .build();
    }

    @GetMapping("/revenue/yearly")
    public ApiResponse<List<RevenueStatisticsResponse>> getRevenueByYear() {
        return ApiResponse.<List<RevenueStatisticsResponse>>builder()
                .code(200)
                .message("success")
                .result(invoiceService.getRevenueByYear())
                .build();
    }
}