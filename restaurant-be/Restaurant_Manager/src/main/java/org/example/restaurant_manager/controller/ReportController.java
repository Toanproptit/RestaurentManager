package org.example.restaurant_manager.controller;


import java.util.List;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.DashboardSummaryResponse;
import org.example.restaurant_manager.dto.response.RevenueStatisticsResponse;
import org.example.restaurant_manager.service.InvoiceService;
import org.example.restaurant_manager.service.ReportService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    public final InvoiceService invoiceService;
    public final ReportService reportService;

    @GetMapping("/summary")
    public ApiResponse<DashboardSummaryResponse> getSummary() {
        return ApiResponse.<DashboardSummaryResponse>builder()
                .code(200)
                .message("success")
                .result(reportService.getDashboardSummary())
                .build();
    }

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