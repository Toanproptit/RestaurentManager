package org.example.restaurant_manager.service;


import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.entity.Food;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.mapper.OrderDetailMapper;
import org.example.restaurant_manager.entity.OrderDetail;
import org.example.restaurant_manager.repository.FoodRepository;
import org.example.restaurant_manager.repository.OrderDetailRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    private final FoodRepository foodRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper orderDetailMapper;

    public OrderDetailService(FoodRepository foodRepository,
                              OrderRepository orderRepository,
                              OrderDetailRepository orderDetailRepository,
                              OrderDetailMapper orderDetailMapper) {
        this.foodRepository = foodRepository;
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.orderDetailMapper = orderDetailMapper;
    }

    public OrderDetailResponse create(OrderDetail orderDetail, Long orderId, Long foodId) {
        Food food = foodRepository.findById(foodId)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + foodId));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        orderDetail.setFood(food);
        orderDetail.setOrder(order);
        orderDetail.setPrice(food.getPrice());

        OrderDetail saved = orderDetailRepository.save(orderDetail);
        return orderDetailMapper.toOrderDetailResponse(saved);
    }

    public List<OrderDetailResponse> getAll() {
        return orderDetailRepository.findAll()
                .stream()
                .map(orderDetailMapper::toOrderDetailResponse)
                .toList();
    }

    public OrderDetailResponse getById(Long id) {
        return orderDetailMapper.toOrderDetailResponse(getEntity(id));
    }

    public void deleteById(Long id) {
        if (!orderDetailRepository.existsById(id)) {
            throw new RuntimeException("OrderDetail not found with id: " + id);
        }
        orderDetailRepository.deleteById(id);
    }

    public OrderDetailResponse update(Long id, OrderDetail newOrderDetail, Long foodId) {
        OrderDetail oldOrderDetail = getEntity(id);

        if (foodId != null) {
            Food food = foodRepository.findById(foodId)
                    .orElseThrow(() -> new RuntimeException("Food not found with id: " + foodId));
            oldOrderDetail.setFood(food);
            oldOrderDetail.setPrice(food.getPrice());
        }

        oldOrderDetail.setQuantity(newOrderDetail.getQuantity());

        OrderDetail saved = orderDetailRepository.save(oldOrderDetail);
        return orderDetailMapper.toOrderDetailResponse(saved);
    }

    public OrderDetail getEntity(Long id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderDetail not found with id: " + id));
    }
}