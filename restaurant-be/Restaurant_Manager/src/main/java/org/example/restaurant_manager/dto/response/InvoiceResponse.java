package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class InvoiceResponse {
    private Date invoiceDate;
    private double total;
}
