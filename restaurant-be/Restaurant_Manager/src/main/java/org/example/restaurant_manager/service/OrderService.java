package org.example.restaurant_manager.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.example.restaurant_manager.dto.request.CreateOrderRequest;
import org.example.restaurant_manager.dto.request.UpdateOrderRequest;
import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.entity.DiningTable;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.enums.OrderStatus;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.OrderMapper;
import org.example.restaurant_manager.repository.DiningTableRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final DiningTableRepository diningTableRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper,
                        DiningTableRepository diningTableRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.diningTableRepository = diningTableRepository;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {

        Order order = new Order();

        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(new Date());
        order.setOrderDetails(new ArrayList<>());
        order.setDiningTables(new HashSet<>());

        replaceDiningTables(order, request.getDiningTableIds());

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

    @Transactional
    public OrderResponse update(Long id, UpdateOrderRequest newOrder) {

        Order oldOrder = getEntity(id);

        if (newOrder.getStatus() != null) {
            oldOrder.setStatus(newOrder.getStatus());
        }

        if (newOrder.getDiningTableIds() != null) {
            replaceDiningTables(oldOrder, newOrder.getDiningTableIds());
        }

        oldOrder.setTotalAmount(calculateTotal(oldOrder));

        return orderMapper.toOrderResponse(orderRepository.save(oldOrder));
    }

    @Transactional
    public void delete(Long id) {
        Order order = getEntity(id);

        new HashSet<>(order.getDiningTables()).forEach(order::removeDiningTable);

        orderRepository.delete(order);
    }

    public Order getEntity(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }

    private Long calculateTotal(Order order) {
        return order.getOrderDetails()
                .stream()
                .mapToLong(detail ->
                        Math.round(detail.getPrice() * detail.getQuantity()))
                .sum();
    }

    private void replaceDiningTables(Order order, List<Long> diningTableIds) {
        Set<DiningTable> currentTables = new HashSet<>(order.getDiningTables());
        currentTables.forEach(order::removeDiningTable);

        if (diningTableIds == null) {
            return;
        }

        diningTableIds.stream()
                .distinct()
                .map(this::getDiningTable)
                .forEach(diningTable -> {
                    if (diningTable.getOrder() != null && diningTable.getOrder() != order) {
                        diningTable.getOrder().getDiningTables().remove(diningTable);
                    }
                    order.addDiningTable(diningTable);
                });
    }

    private DiningTable getDiningTable(Long id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DINING_TABLE_NOT_FOUND));
    }

}