package org.example.restaurant_manager.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.example.restaurant_manager.dto.request.CreateReservationDetailRequest;
import org.example.restaurant_manager.dto.request.UpdateReservationDetailRequest;
import org.example.restaurant_manager.dto.response.ReservationDetailResponse;
import org.example.restaurant_manager.entity.DiningTable;
import org.example.restaurant_manager.entity.Reservation;
import org.example.restaurant_manager.entity.ReservationDetail;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.ReservationDetailMapper;
import org.example.restaurant_manager.repository.DiningTableRepository;
import org.example.restaurant_manager.repository.ReservationDetailRepository;
import org.example.restaurant_manager.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ReservationDetailService {

    private final ReservationDetailRepository reservationDetailRepository;
    private final ReservationDetailMapper reservationDetailMapper;
    private final ReservationRepository reservationRepository;
    private final DiningTableRepository diningTableRepository;

    public ReservationDetailService(ReservationDetailRepository reservationDetailRepository,
                                    ReservationDetailMapper reservationDetailMapper,
                                    ReservationRepository reservationRepository,
                                    DiningTableRepository diningTableRepository) {
        this.reservationDetailRepository = reservationDetailRepository;
        this.reservationDetailMapper = reservationDetailMapper;
        this.reservationRepository = reservationRepository;
        this.diningTableRepository = diningTableRepository;
    }

    public List<ReservationDetailResponse> findAll() {
        return reservationDetailRepository.findAll()
                .stream()
                .map(reservationDetailMapper::toResponse)
                .toList();
    }

    public ReservationDetailResponse findById(Long id) {
        return reservationDetailMapper.toResponse(getEntity(id));
    }

    @Transactional
    public ReservationDetailResponse create(CreateReservationDetailRequest request) {
        ReservationDetail detail = new ReservationDetail();
        detail.setReservation(getReservation(request.getReservationId()));

        if (request.getDiningTableIds() != null) {
            replaceDiningTables(detail, request.getDiningTableIds());
        }

        return reservationDetailMapper.toResponse(
                reservationDetailRepository.save(detail)
        );
    }

    @Transactional
    public ReservationDetailResponse update(Long id, UpdateReservationDetailRequest newDetail) {
        ReservationDetail oldDetail = getEntity(id);

        if (newDetail.getReservationId() != null) {
            oldDetail.setReservation(getReservation(newDetail.getReservationId()));
        }

        if (newDetail.getDiningTableIds() != null) {
            replaceDiningTables(oldDetail, newDetail.getDiningTableIds());
        }

        return reservationDetailMapper.toResponse(oldDetail);
    }

    @Transactional
    public void deleteById(Long id) {
        ReservationDetail detail = getEntity(id);

        new HashSet<>(detail.getDiningTables()).forEach(detail::removeDiningTable);

        reservationDetailRepository.delete(detail);
    }

    private ReservationDetail getEntity(Long id) {
        return reservationDetailRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_DETAIL_NOT_FOUND));
    }

    private Reservation getReservation(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_NOT_FOUND));
    }

    private void replaceDiningTables(ReservationDetail detail, List<Long> diningTableIds) {
        Set<DiningTable> currentTables = new HashSet<>(detail.getDiningTables());
        currentTables.forEach(detail::removeDiningTable);

        diningTableIds.stream()
                .distinct()
                .map(this::getDiningTable)
                .forEach(diningTable -> {
                    if (diningTable.getReservationDetail() != null
                            && diningTable.getReservationDetail() != detail) {
                        diningTable.getReservationDetail().getDiningTables().remove(diningTable);
                    }
                    detail.addDiningTable(diningTable);
                });
    }

    private DiningTable getDiningTable(Long id) {
        return diningTableRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DINING_TABLE_NOT_FOUND));
    }
}