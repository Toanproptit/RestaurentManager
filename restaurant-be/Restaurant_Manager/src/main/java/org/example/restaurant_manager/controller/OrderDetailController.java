package org.example.restaurant_manager.controller;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.model.OrderDetail;
import org.example.restaurant_manager.service.OrderDetailService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders/{orderId}/details")
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @PostMapping
    public ApiResponse<OrderDetailResponse> create(
            @PathVariable Long orderId,
            @RequestBody OrderDetail orderDetail) {


        return ApiResponse.<OrderDetailResponse>builder()
                .code(200)
                .message("Created successfully")
                .result(orderDetailService.create(orderDetail))
                .build();
    }


    @GetMapping
    public ApiResponse<List<OrderDetailResponse>> getAll() {
        return ApiResponse.<List<OrderDetailResponse>>builder()
                .code(200)
                .message("Success")
                .result(orderDetailService.getAll())
                .build();
    }


    @GetMapping("/{detailId}")
    public ApiResponse<OrderDetailResponse> getById(
            @PathVariable Long detailId) {

        return ApiResponse.<OrderDetailResponse>builder()
                .code(200)
                .message("Success")
                .result(orderDetailService.getById(detailId))
                .build();
    }


    @PutMapping("/{detailId}")
    public ApiResponse<OrderDetailResponse> update(
            @PathVariable Long detailId,
            @RequestBody OrderDetail orderDetail) {

        return ApiResponse.<OrderDetailResponse>builder()
                .code(200)
                .message("Updated successfully")
                .result(orderDetailService.update(detailId, orderDetail))
                .build();
    }

    @DeleteMapping("/{detailId}")
    public ApiResponse<Void> delete(@PathVariable Long detailId) {
        orderDetailService.deleteById(detailId);

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Deleted successfully")
                .build();
    }
}