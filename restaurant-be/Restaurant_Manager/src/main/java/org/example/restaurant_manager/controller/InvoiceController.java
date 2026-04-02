package org.example.restaurant_manager.controller;

import java.util.List;
import org.example.restaurant_manager.dto.request.CreateInvoiceRequest;
import org.example.restaurant_manager.dto.response.ApiResponse;
import org.example.restaurant_manager.dto.response.InvoiceResponse;
import org.example.restaurant_manager.dto.response.RevenueStatisticsResponse;
import org.example.restaurant_manager.service.InvoiceService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/order/{orderId}")
    public InvoiceResponse createInvoice(
            @PathVariable("orderId") Long orderId,
            @RequestBody @Valid CreateInvoiceRequest invoice
    ) {
        return invoiceService.createInvoice(orderId, invoice);
    }


}