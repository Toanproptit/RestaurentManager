package org.example.restaurant_manager.mapper;

import org.example.restaurant_manager.dto.response.CustomerResponse;
import org.example.restaurant_manager.model.Customer;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class CustomerMapper {



    private final ReservationSummaryMapper reservationSummaryMapper;

    public CustomerMapper(ReservationSummaryMapper reservationSummaryMapper) {
        this.reservationSummaryMapper = reservationSummaryMapper;
    }


    public CustomerResponse toCustomerResponse(Customer customer){
        return new CustomerResponse(customer.getName(),customer.getEmail(),customer.getPhone(),customer
                .getReservations().stream().map(reservationSummaryMapper::reservationSummeryResponse).collect(Collectors.
                        toSet()));
    }
}
