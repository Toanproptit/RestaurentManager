package org.example.restaurant_manager.dto.request;

import java.util.Date;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateInvoiceRequest {
    @NotNull(message = "Invoice date is required")
    private Date date;

    private double total;
}