package org.example.restaurant_manager.service;

import org.example.restaurant_manager.dto.response.DashboardSummaryResponse;
import org.example.restaurant_manager.repository.InvoiceRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.example.restaurant_manager.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final InvoiceRepository invoiceRepository;
    private final ReservationRepository reservationRepository;

    public DashboardSummaryResponse getDashboardSummary() {
        return new DashboardSummaryResponse(
                orderRepository.count(),
                invoiceRepository.getTotalRevenue(),
                reservationRepository.count()
        );
    }
}