package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.entity.DiningTable;
import org.springframework.stereotype.Component;

@Component
public class DiningTableMapper {
    public DiningTableResponse toDiningTableResponse(DiningTable diningTable){
        return new DiningTableResponse(diningTable.getName(), diningTable.getDescription(),diningTable.getMaxGuests());
    }
}
