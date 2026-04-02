package org.example.restaurant_manager.dto.request;

import java.util.Date;

import lombok.Data;

@Data
public class CreateInvoiceRequest {
    // date là optional, nếu không truyền thì backend tự set = now
    private Date date;
}