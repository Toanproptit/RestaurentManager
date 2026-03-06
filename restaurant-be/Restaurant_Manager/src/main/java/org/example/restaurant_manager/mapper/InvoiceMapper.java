package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.InvoiceResponse;
import org.example.restaurant_manager.entity.Invoice;
import org.springframework.stereotype.Component;

@Component
public class InvoiceMapper {
    public InvoiceResponse toInvoiceResponse(Invoice invoice) {
        return new InvoiceResponse(invoice.getDate(), invoice.getTotal());
    }
}
