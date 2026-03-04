package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
public class CustomerResponse {
    private String name;
    private String email;
    private String phone;
    private Set<ReservationSummaryResponse> reservations = new HashSet<>();
}
