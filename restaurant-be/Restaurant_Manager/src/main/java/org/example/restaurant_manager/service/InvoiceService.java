package org.example.restaurant_manager.service;

import java.util.List;

import org.example.restaurant_manager.dto.request.CreateInvoiceRequest;
import org.example.restaurant_manager.dto.response.InvoiceResponse;
import org.example.restaurant_manager.dto.response.RevenueStatisticsResponse;
import org.example.restaurant_manager.entity.Invoice;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.InvoiceMapper;
import org.example.restaurant_manager.repository.InvoiceRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;
    private final InvoiceMapper invoiceMapper;


    public InvoiceResponse createInvoice(Long orderId, CreateInvoiceRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getInvoice() != null) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_EXISTS);
        }

        Invoice invoice = new Invoice();
        invoice.setDate(request.getDate());
        invoice.setTotal(request.getTotal());

        invoice.attachOrder(order);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        return invoiceMapper.toInvoiceResponse(savedInvoice);
    }

    public List<RevenueStatisticsResponse> getRevenueByDay() {
        return invoiceRepository.getRevenueByDay();
    }

    public List<RevenueStatisticsResponse> getRevenueByMonth() {
        return invoiceRepository.getRevenueByMonth();
    }

    public List<RevenueStatisticsResponse> getRevenueByYear() {
        return invoiceRepository.getRevenueByYear();
    }
}