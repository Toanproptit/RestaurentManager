package org.example.restaurant_manager.service;

import jakarta.transaction.Transactional;
import org.example.restaurant_manager.dto.response.ReservationDetailResponse;
import org.example.restaurant_manager.mapper.ReservationDetailMapper;
import org.example.restaurant_manager.model.DiningTable;
import org.example.restaurant_manager.model.ReservationDetail;
import org.example.restaurant_manager.repository.ReservationDetailRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ReservationDetailService {

    private final ReservationDetailRepository reservationDetailRepository;
    private final ReservationDetailMapper reservationDetailMapper;

    public ReservationDetailService(ReservationDetailRepository reservationDetailRepository,
                                    ReservationDetailMapper reservationDetailMapper) {
        this.reservationDetailRepository = reservationDetailRepository;
        this.reservationDetailMapper = reservationDetailMapper;
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

    public ReservationDetailResponse create(ReservationDetail detail) {

        Set<DiningTable> tables = detail.getDiningTables();

        detail.setDiningTables(new HashSet<>());

        if(tables != null){
            tables.forEach(detail::addDiningTable);
        }

        return reservationDetailMapper.toResponse(
                reservationDetailRepository.save(detail)
        );
    }

    @Transactional
    public ReservationDetailResponse update(Long id, ReservationDetail newDetail) {
        ReservationDetail oldDetail = getEntity(id);

        oldDetail.setReservation(newDetail.getReservation());

        return reservationDetailMapper.toResponse(oldDetail);
    }

    public void deleteById(Long id) {
        ReservationDetail detail = getEntity(id);
        reservationDetailRepository.delete(detail);
    }

    private ReservationDetail getEntity(Long id) {
        return reservationDetailRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ReservationDetail not found"));
    }
}