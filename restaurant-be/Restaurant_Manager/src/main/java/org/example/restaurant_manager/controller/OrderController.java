package org.example.restaurant_manager.controller;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }


    @PostMapping
    public ApiResponse<OrderResponse> create(@RequestBody Order order) {

        return ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("Order created successfully")
                .result(orderService.create(order))
                .build();
    }


    @GetMapping
    public ApiResponse<List<OrderResponse>> getAll() {

        return ApiResponse.<List<OrderResponse>>builder()
                .code(200)
                .message("Success")
                .result(orderService.getAll())
                .build();
    }


    @GetMapping("/{id}")
    public ApiResponse<OrderResponse> getById(@PathVariable Long id) {

        return ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("Success")
                .result(orderService.getById(id))
                .build();
    }


    @PutMapping("/{id}")
    public ApiResponse<OrderResponse> update(
            @PathVariable Long id,
            @RequestBody Order order) {

        return ApiResponse.<OrderResponse>builder()
                .code(200)
                .message("Order updated successfully")
                .result(orderService.update(id, order))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {

        orderService.delete(id);

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Order deleted successfully")
                .build();
    }
}