package org.example.restaurant_manager.controller;

import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.model.DiningTable;
import org.example.restaurant_manager.service.DiningTableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/dining-tables")
public class DiningTableController {

    private final DiningTableService diningTableService;

    public DiningTableController(DiningTableService diningTableService) {
        this.diningTableService = diningTableService;
    }

    @GetMapping
    public ApiResponse<List<DiningTableResponse>> getAll() {
        return ApiResponse.<List<DiningTableResponse>>builder()
                .code(200)
                .message("success")
                .result(diningTableService.findAll())
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<DiningTableResponse> getById(@PathVariable Long id) {
        return ApiResponse.<DiningTableResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.findById(id))
                .build();
    }

    @PostMapping
    public ApiResponse<DiningTableResponse> create(@RequestBody DiningTable diningTable) {
        return ApiResponse.<DiningTableResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.create(diningTable))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<DiningTableResponse> update(
            @PathVariable Long id,
            @RequestBody DiningTable diningTable
    ) {
        return ApiResponse.<DiningTableResponse>builder()
                .code(200)
                .message("success")
                .result(diningTableService.update(id, diningTable))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        diningTableService.deleteById(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Deleted success")
                .build();
    }
}