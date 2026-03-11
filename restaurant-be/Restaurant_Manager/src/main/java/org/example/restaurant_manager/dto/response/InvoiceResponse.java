package org.example.restaurant_manager.dto.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvoiceResponse {
    private Long id;
    private Long orderId;
    private Date invoiceDate;
    private double total;
}
