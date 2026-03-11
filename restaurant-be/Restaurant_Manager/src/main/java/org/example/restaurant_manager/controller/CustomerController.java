package org.example.restaurant_manager.controller;


import java.util.List;

import org.example.restaurant_manager.dto.request.CreateCustomerRequest;
import org.example.restaurant_manager.dto.request.UpdateCustomerRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.CustomerResponse;
import org.example.restaurant_manager.service.CustomerService;
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
@RequestMapping("/customers")
public class CustomerController {
    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ApiResponse<CustomerResponse> creat(@RequestBody @Valid CreateCustomerRequest customer){
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("success")
                .result(customerService.create(customer))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<CustomerResponse> getById(@PathVariable Long id){
        return ApiResponse.<CustomerResponse>builder()
                .code(200)
                .message("success")
                .result(customerService.findById(id))
                .build();
    }

    @GetMapping
    public ApiResponse<List<CustomerResponse>> getAll(){
        return ApiResponse.<List<CustomerResponse>>builder()
                .code(200)
                .message("success")
                .result(customerService.findAll())
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<CustomerResponse> update(@PathVariable Long id , @RequestBody @Valid UpdateCustomerRequest customer){
        return ApiResponse.<CustomerResponse> builder()
                .code(200)
                .message("success")
                .result(customerService.update(id, customer))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id){
        customerService.deleteById(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("success")
                .build();
    }
}
