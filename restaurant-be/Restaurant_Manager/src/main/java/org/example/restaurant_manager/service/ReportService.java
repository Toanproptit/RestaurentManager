package org.example.restaurant_manager.service;

import java.time.LocalDate;
import java.util.List;

import org.example.restaurant_manager.dto.response.DashboardSummaryResponse;
import org.example.restaurant_manager.dto.response.OrderCountByFoodResponse;
import org.example.restaurant_manager.repository.InvoiceRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.example.restaurant_manager.repository.ReservationRepository;
import org.example.restaurant_manager.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReservationRepository reservationRepository;
    private final OrderDetailRepository orderDetailRepository;

    public DashboardSummaryResponse getDashboardSummary() {
        return new DashboardSummaryResponse(
                orderRepository.count(),
                invoiceRepository.getTotalRevenue(),
                reservationRepository.count()
        );
    }

    public List<OrderCountByFoodResponse> getOrderCountByFood(LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return orderDetailRepository.getOrderCountByFoodOnDate(date);
    }
}