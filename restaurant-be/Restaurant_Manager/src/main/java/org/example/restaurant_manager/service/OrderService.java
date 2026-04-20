package org.example.restaurant_manager.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.example.restaurant_manager.dto.request.CreateOrderRequest;
import org.example.restaurant_manager.dto.request.UpdateOrderRequest;
import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.dto.response.PageResponse;
import org.example.restaurant_manager.entity.DiningTable;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.entity.User;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.enums.OrderStatus;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.OrderMapper;
import org.example.restaurant_manager.repository.DiningTableRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.example.restaurant_manager.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final DiningTableRepository diningTableRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderMapper orderMapper,
                        DiningTableRepository diningTableRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.diningTableRepository = diningTableRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse create(CreateOrderRequest request) {

        Order order = new Order();

        order.setStatus(OrderStatus.PENDING);
        order.setOrderDate(new Date());
        order.setOrderDetails(new ArrayList<>());

        if (request.getUsername() != null) {
            User user = getUserByUsername(request.getUsername());
            order.setUser(user);
        } else if (request.getUserId() != null) {
            User user = getUser(request.getUserId());
            order.setUser(user);
        }

        replaceDiningTable(order, request.getDiningTableId());

        order.setTotalAmount(calculateTotal(order));

        Order savedOrder = orderRepository.save(order);


        return orderMapper.toOrderResponse(savedOrder);
    }

//    public List<OrderResponse> getAll() {
//        return orderRepository.findAll()
//                .stream()
//                .map(orderMapper::toOrderResponse)
//                .toList();
//    }

    public PageResponse<OrderResponse> findAll(int page, int size) {

        int validatedPage = page;
        int validatedSize = size;

        Page<Order> oldpage = orderRepository
                .findAll(PageRequest.of(validatedPage, validatedSize, Sort.by("id").descending()));

        List<OrderResponse> content = oldpage.stream().map(orderMapper :: toOrderResponse).toList();

        return PageResponse.<OrderResponse>builder()
                .content(content)
                .size(size)
                .page(page)
                .totalElements(oldpage.getTotalElements())
                .totalPages(oldpage.getTotalPages())
                .first(oldpage.isFirst())
                .last(oldpage.isLast())
                .build();


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

        if (newOrder.getDiningTableId() != null) {
            replaceDiningTable(oldOrder, newOrder.getDiningTableId());
        }

        if (newOrder.getTotalAmount() != null) {
            oldOrder.setTotalAmount(newOrder.getTotalAmount());
        } else {
            oldOrder.setTotalAmount(calculateTotal(oldOrder));
        }

        return orderMapper.toOrderResponse(orderRepository.save(oldOrder));
    }

    @Transactional
    public void delete(Long id) {
        Order order = getEntity(id);

        order.clearDiningTable();

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

    private void replaceDiningTable(Order order, Long diningTableId) {
        order.clearDiningTable();

        if (diningTableId == null) {
            return;
        }

        DiningTable diningTable = getDiningTable(diningTableId);

        if (diningTable.getOrder() != null && diningTable.getOrder() != order) {
            diningTable.getOrder().clearDiningTable();
        }

        order.assignDiningTable(diningTable);
    }

    private DiningTable getDiningTable(Long id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DINING_TABLE_NOT_FOUND));
    }

    private User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private User getUserByUsername(String username) {
        return userRepository.findByName(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

}