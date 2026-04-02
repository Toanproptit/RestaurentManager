package org.example.restaurant_manager.controller;

import java.util.List;

import org.example.restaurant_manager.dto.request.CreateDiningTableRequest;
import org.example.restaurant_manager.dto.request.UpdateDiningTableRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.dto.response.TableStatisticsResponse;
import org.example.restaurant_manager.service.DiningTableService;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/dining-tables")
public class DiningTableController {

    private final DiningTableService diningTableService;

    public DiningTableController(DiningTableService diningTableService) {
        this.diningTableService = diningTableService;
    }

    @GetMapping
    public ApiResponse<PageResponse<DiningTableResponse>> getAll(
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        return ApiResponse.<PageResponse<DiningTableResponse>>builder()
                .code(200)
                .message("success")
                .result(diningTableService.findAll(page,size))
                .build();
    }

    @GetMapping("/statistics")
    public ApiResponse<TableStatisticsResponse> getStatistics() {
        return ApiResponse.<TableStatisticsResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.getStatistics())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DiningTableResponse> getById(@PathVariable("id") Long id) {
        return ApiResponse.<DiningTableResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<DiningTableResponse> create(@RequestBody @Valid CreateDiningTableRequest diningTable) {
        return ApiResponse.<DiningTableResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.create(diningTable))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DiningTableResponse> update(
            @PathVariable("id") Long id,
            @RequestBody @Valid UpdateDiningTableRequest diningTable
    ) {
        return ApiResponse.<DiningTableResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.update(id, diningTable))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        diningTableService.deleteById(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Deleted success")
                .build();
    }
}