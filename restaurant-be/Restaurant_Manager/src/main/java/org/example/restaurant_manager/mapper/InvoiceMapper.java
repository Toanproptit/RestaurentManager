package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.InvoiceResponse;
import org.example.restaurant_manager.entity.Invoice;
import org.springframework.stereotype.Component;

@Component
public class InvoiceMapper {
    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        Long orderId = invoice.getOrder() != null ? invoice.getOrder().getId() : null;

        return new InvoiceResponse(
                invoice.getId(),
                orderId,
                invoice.getDate(),
                invoice.getTotal()
        );
    }
}
