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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final OrderRepository orderRepository;
    private final InvoiceMapper invoiceMapper;


    @Transactional
    public InvoiceResponse createInvoice(Long orderId, CreateInvoiceRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getInvoice() != null) {
            throw new AppException(ErrorCode.INVOICE_ALREADY_EXISTS);
        }

        Invoice invoice = new Invoice();
        invoice.setDate(request.getDate());
    invoice.setTotal(resolveInvoiceTotal(order));

        invoice.attachOrder(order);

        Invoice savedInvoice = invoiceRepository.save(invoice);

        return invoiceMapper.toInvoiceResponse(savedInvoice);
    }

    public InvoiceResponse getInvoice(Long orderId) {
        if(orderRepository.findById(orderId).isEmpty()) {
            throw new AppException(ErrorCode.ORDER_NOT_FOUND);
        }
        Invoice invoice = invoiceRepository.findById(orderId).get();
        return invoiceMapper.toInvoiceResponse(invoice);
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

    private double resolveInvoiceTotal(Order order) {
        Long totalAmount = order.getTotalAmount();
        if (totalAmount != null && totalAmount > 0) {
            return totalAmount.doubleValue();
        }

        long derivedTotal = order.getOrderDetails() == null ? 0L : order.getOrderDetails()
                .stream()
                .mapToLong(detail -> Math.round(getSafePrice(detail.getPrice()) * getSafeQuantity(detail.getQuantity())))
                .sum();

        if (derivedTotal > 0) {
            order.setTotalAmount(derivedTotal);
        }

        return (double) derivedTotal;
    }

    private long getSafeQuantity(Long quantity) {
        return quantity == null ? 0L : quantity;
    }

    private double getSafePrice(Double price) {
        return price == null ? 0D : price;
    }
}