package org.example.restaurant_manager.controller;

import lombok.RequiredArgsConstructor;
import org.example.restaurant_manager.dto.response.InvoiceResponse;
import org.example.restaurant_manager.entity.Invoice;
import org.example.restaurant_manager.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/order/{orderId}")
    public InvoiceResponse createInvoice(
            @PathVariable Long orderId,
            @RequestBody Invoice invoice
    ) {
        return invoiceService.createInvoice(orderId, invoice);
    }
}