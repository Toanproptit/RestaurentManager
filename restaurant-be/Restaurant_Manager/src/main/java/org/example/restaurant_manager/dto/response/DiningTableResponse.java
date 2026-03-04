package org.example.restaurant_manager.dto.response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class DiningTableResponse {
    private String name;
    private String description;
    private int maxGuests;
}
