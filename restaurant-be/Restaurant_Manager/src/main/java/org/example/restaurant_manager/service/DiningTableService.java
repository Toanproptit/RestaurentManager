package org.example.restaurant_manager.service;

import java.util.List;

import org.example.restaurant_manager.dto.request.CreateDiningTableRequest;
import org.example.restaurant_manager.dto.request.UpdateDiningTableRequest;
import org.example.restaurant_manager.dto.response.DiningTableResponse;
import org.example.restaurant_manager.entity.DiningTable;
import org.example.restaurant_manager.entity.Order;
import org.example.restaurant_manager.entity.ReservationDetail;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.DiningTableMapper;
import org.example.restaurant_manager.repository.DiningTableRepository;
import org.example.restaurant_manager.repository.OrderRepository;
import org.example.restaurant_manager.repository.ReservationDetailRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class DiningTableService {

    private final DiningTableRepository diningTableRepository;
    private final DiningTableMapper diningTableMapper;
    private final ReservationDetailRepository reservationDetailRepository;
    private final OrderRepository orderRepository;

    public DiningTableService(DiningTableRepository diningTableRepository,
                              DiningTableMapper diningTableMapper,
                              ReservationDetailRepository reservationDetailRepository,
                              OrderRepository orderRepository) {
        this.diningTableRepository = diningTableRepository;
        this.diningTableMapper = diningTableMapper;
        this.reservationDetailRepository = reservationDetailRepository;
        this.orderRepository = orderRepository;
    }

    public List<DiningTableResponse> findAll() {
        return diningTableRepository.findAll()
                .stream()
                .map(diningTableMapper::toDiningTableResponse)
                .toList();
    }

    public DiningTableResponse findById(Long id) {
        return diningTableMapper.toDiningTableResponse(getEntity(id));
    }

    public DiningTableResponse create(CreateDiningTableRequest request) {
        DiningTable diningTable = new DiningTable();
        diningTable.setName(request.getName());
        diningTable.setDescription(request.getDescription());
        diningTable.setMaxGuests(request.getMaxGuests());
        diningTable.setReservationDetail(getReservationDetail(request.getReservationDetailId()));
        diningTable.setOrder(getOrder(request.getOrderId()));

        return diningTableMapper.toDiningTableResponse(
                diningTableRepository.save(diningTable)
        );
    }

    @Transactional
    public DiningTableResponse update(Long id, UpdateDiningTableRequest newTable) {
        DiningTable oldTable = getEntity(id);

        if (newTable.getName() != null) {
            oldTable.setName(newTable.getName());
        }
        if (newTable.getDescription() != null) {
            oldTable.setDescription(newTable.getDescription());
        }
        if (newTable.getMaxGuests() != null) {
            oldTable.setMaxGuests(newTable.getMaxGuests());
        }
        if (newTable.getReservationDetailId() != null) {
            oldTable.setReservationDetail(getReservationDetail(newTable.getReservationDetailId()));
        }
        if (newTable.getOrderId() != null) {
            oldTable.setOrder(getOrder(newTable.getOrderId()));
        }

        return diningTableMapper.toDiningTableResponse(oldTable);
    }

    public void deleteById(Long id) {
        DiningTable table = getEntity(id);
        diningTableRepository.delete(table);
    }

    private DiningTable getEntity(Long id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DINING_TABLE_NOT_FOUND));
    }

    private ReservationDetail getReservationDetail(Long id) {
        return reservationDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_DETAIL_NOT_FOUND));
    }

    private Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
    }
}