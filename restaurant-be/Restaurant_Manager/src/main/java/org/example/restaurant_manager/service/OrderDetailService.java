package org.example.restaurant_manager.service;


import org.example.restaurant_manager.dto.response.OrderDetailResponse;
import org.example.restaurant_manager.dto.response.OrderResponse;
import org.example.restaurant_manager.mapper.OrderDetailMapper;
import org.example.restaurant_manager.model.OrderDetail;
import org.example.restaurant_manager.repository.OrderDetailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;
    private final OrderDetailMapper  orderDetailMapper;

    public OrderDetailService(OrderDetailRepository orderDetailRepository, OrderDetailMapper orderDetailMapper) {
        this.orderDetailRepository = orderDetailRepository;
        this.orderDetailMapper = orderDetailMapper;
    }

    public OrderDetailResponse create(OrderDetail OrderDetail) {
        OrderDetail orderDetail = orderDetailRepository.save(OrderDetail);
        return orderDetailMapper.toOrderDetailResponse(orderDetail);
    }

    public List<OrderDetailResponse> getAll(){
        return orderDetailRepository.findAll().stream().map(orderDetailMapper::toOrderDetailResponse).toList();
    }

    public OrderDetailResponse getById(Long id){
        return orderDetailRepository.findById(id).map(orderDetailMapper::toOrderDetailResponse).orElse(null);
    }

    public void deleteById(Long id){
        orderDetailRepository.deleteById(id);
    }
    public OrderDetailResponse update(Long id,OrderDetail newOrderDetail){
        OrderDetail oldOrderDetail = getEntity(id);
        oldOrderDetail.setPrice(newOrderDetail.getPrice());
        oldOrderDetail.setQuantity(newOrderDetail.getQuantity());
        return orderDetailMapper.toOrderDetailResponse(orderDetailRepository.save(oldOrderDetail));
    }

    public OrderDetail getEntity(Long id){
        return orderDetailRepository.findById(id).orElse(null);
    }
}


