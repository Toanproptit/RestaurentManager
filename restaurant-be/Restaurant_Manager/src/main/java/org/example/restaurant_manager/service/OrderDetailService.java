package org.example.restaurant_manager.service;


import java.util.List;

import org.example.restaurant_manager.dto.request.CreateOrderDetailRequest;
import org.example.restaurant_manager.dto.request.UpdateOrderDetailRequest;
import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.entity.Food;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.entity.OrderDetail;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.OrderDetailMapper;
import org.example.restaurant_manager.repository.FoodRepository;
import org.example.restaurant_manager.repository.OrderDetailRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

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

    @Transactional
    public OrderDetailResponse create(CreateOrderDetailRequest request, Long orderId, Long foodId) {
        Long resolvedFoodId = foodId != null ? foodId : request.getFoodId();

        if (resolvedFoodId == null) {
            throw new AppException(ErrorCode.FOOD_ID_REQUIRED);
        }

        Food food = foodRepository.findById(resolvedFoodId)
            .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));

        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        OrderDetail existing = orderDetailRepository.findByOrderIdAndFoodId(orderId, resolvedFoodId).orElse(null);
        if (existing != null) {
            long oldQuantity = getSafeQuantity(existing.getQuantity());
            long addQuantity = getSafeQuantity(request.getQuantity());
            existing.setQuantity(oldQuantity + addQuantity);
            existing.setPrice(food.getPrice());
            OrderDetail saved = orderDetailRepository.save(existing);
            refreshOrderTotal(orderId);
            return orderDetailMapper.toOrderDetailResponse(saved);
        }

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setQuantity(request.getQuantity());

        orderDetail.setFood(food);
        orderDetail.setOrder(order);
        orderDetail.setPrice(food.getPrice());

        OrderDetail saved = orderDetailRepository.save(orderDetail);
        refreshOrderTotal(orderId);
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

    @Transactional
    public void deleteById(Long id) {
        OrderDetail oldOrderDetail = getEntity(id);
        Long orderId = oldOrderDetail.getOrder() != null ? oldOrderDetail.getOrder().getId() : null;

        orderDetailRepository.delete(oldOrderDetail);

        if (orderId != null) {
            refreshOrderTotal(orderId);
        }
    }

    @Transactional
    public OrderDetailResponse update(Long id, UpdateOrderDetailRequest newOrderDetail, Long foodId) {
        OrderDetail oldOrderDetail = getEntity(id);
        Long orderId = oldOrderDetail.getOrder() != null ? oldOrderDetail.getOrder().getId() : null;

        if (foodId != null) {
            Food food = foodRepository.findById(foodId)
                    .orElseThrow(() -> new AppException(ErrorCode.FOOD_NOT_FOUND));
            oldOrderDetail.setFood(food);
            oldOrderDetail.setPrice(food.getPrice());
        }

        oldOrderDetail.setQuantity(newOrderDetail.getQuantity());

        OrderDetail saved = orderDetailRepository.save(oldOrderDetail);
        if (orderId != null) {
            refreshOrderTotal(orderId);
        }
        return orderDetailMapper.toOrderDetailResponse(saved);
    }

    public OrderDetail getEntity(Long id) {
        return orderDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_DETAIL_NOT_FOUND));
    }

    private long getSafeQuantity(Long quantity) {
        return quantity == null ? 0L : quantity;
    }

    private void refreshOrderTotal(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        long total = orderDetailRepository.findByOrderId(orderId)
                .stream()
                .mapToLong(detail -> Math.round(getSafePrice(detail.getPrice()) * getSafeQuantity(detail.getQuantity())))
                .sum();

        order.setTotalAmount(total);
        orderRepository.save(order);
    }

    private double getSafePrice(Double price) {
        return price == null ? 0D : price;
    }
}