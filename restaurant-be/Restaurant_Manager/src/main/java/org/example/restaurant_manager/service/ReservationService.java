package org.example.restaurant_manager.service;

import jakarta.transaction.Transactional;
import org.example.restaurant_manager.dto.response.ReservationResponse;
import org.example.restaurant_manager.mapper.ReservationMapper;
import org.example.restaurant_manager.model.Reservation;
import org.example.restaurant_manager.model.ReservationDetail;
import org.example.restaurant_manager.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;

    public ReservationService(ReservationRepository reservationRepository,
                              ReservationMapper reservationMapper) {
        this.reservationRepository = reservationRepository;
        this.reservationMapper = reservationMapper;
    }

    public List<ReservationResponse> findAll() {
        return reservationRepository.findAll()
                .stream()
                .map(reservationMapper::toReservationResponse)
                .toList();
    }

    public ReservationResponse findById(Long id) {
        return reservationMapper.toReservationResponse(getEntity(id));
    }

    public ReservationResponse create(Reservation reservation) {

        Set<ReservationDetail> reservationDetails = reservation.getReservationDetail();

        reservation.setReservationDetail(new HashSet<>());
        if(reservationDetails != null) {
            reservationDetails.forEach(reservation::addDetaiReservations);
        }

        return reservationMapper.toReservationResponse(
                reservationRepository.save(reservation)
        );
    }

    @Transactional
    public ReservationResponse update(Long id, Reservation newReservation) {
        Reservation oldReservation = getEntity(id);

        oldReservation.setReservationDate(newReservation.getReservationDate());
        oldReservation.setStartTime(newReservation.getStartTime());
        oldReservation.setEndTime(newReservation.getEndTime());
        oldReservation.setCustomer(newReservation.getCustomer());

        return reservationMapper.toReservationResponse(oldReservation);
    }

    public void deleteById(Long id) {
        Reservation reservation = getEntity(id);
        reservationRepository.delete(reservation);
    }

    private Reservation getEntity(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));
    }
}