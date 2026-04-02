package org.example.restaurant_manager.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableStatisticsResponse {
    private long total;
    private long available;
    private long reserved;
    private long order;
}
