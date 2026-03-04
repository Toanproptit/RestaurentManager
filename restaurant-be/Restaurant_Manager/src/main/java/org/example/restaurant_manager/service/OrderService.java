package org.example.restaurant_manager.service;

import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.enums.OrderStatus;
import org.example.restaurant_manager.mapper.OrderMapper;
import org.example.restaurant_manager.model.Order;
import org.example.restaurant_manager.model.OrderDetail;
import org.example.restaurant_manager.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
    }

    public OrderResponse create(Order order) {

        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(new Date());

        List<OrderDetail> orderDetails = order.getOrderDetails();
        order.setOrderDetails(new ArrayList<>());
        if(orderDetails != null) {
            orderDetails.forEach(order::addOrderDetail);
        }
        order.setTotalAmount(calculateTotal(order));

        Order savedOrder = orderRepository.save(order);


        return orderMapper.toOrderResponse(savedOrder);
    }

    public List<OrderResponse> getAll() {
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toOrderResponse)
                .toList();
    }

    public OrderResponse getById(Long id) {
        Order order = getEntity(id);
        return orderMapper.toOrderResponse(order);
    }

    public OrderResponse update(Long id, Order newOrder) {

        Order oldOrder = getEntity(id);

        oldOrder.setStatus(newOrder.getStatus());
        oldOrder.setTotalAmount(calculateTotal(oldOrder));

        return orderMapper.toOrderResponse(orderRepository.save(oldOrder));
    }

    public void delete(Long id) {
        Order order = getEntity(id);
        orderRepository.delete(order);
    }

    public Order getEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    private Long calculateTotal(Order order) {
        return order.getOrderDetails()
                .stream()
                .mapToLong(detail ->
                        Math.round(detail.getPrice() * detail.getQuantity()))
                .sum();
    }

}