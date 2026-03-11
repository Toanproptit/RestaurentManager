package org.example.restaurant_manager.service;

import java.util.List;

import org.example.restaurant_manager.dto.request.CreateReservationRequest;
import org.example.restaurant_manager.dto.request.UpdateReservationRequest;
import org.example.restaurant_manager.dto.response.ReservationResponse;
import org.example.restaurant_manager.entity.Customer;
import org.example.restaurant_manager.entity.Reservation;
import org.example.restaurant_manager.enums.ErrorCode;
import org.example.restaurant_manager.exception.AppException;
import org.example.restaurant_manager.mapper.ReservationMapper;
import org.example.restaurant_manager.repository.CustomerRepository;
import org.example.restaurant_manager.repository.ReservationRepository;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final ReservationMapper reservationMapper;
    private final CustomerRepository customerRepository;

    public ReservationService(ReservationRepository reservationRepository,
                              ReservationMapper reservationMapper,
                              CustomerRepository customerRepository) {
        this.reservationRepository = reservationRepository;
        this.reservationMapper = reservationMapper;
        this.customerRepository = customerRepository;
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

    public ReservationResponse create(CreateReservationRequest request) {
        Reservation reservation = new Reservation();
        reservation.setReservationDate(request.getReservationDate());
        reservation.setStartTime(request.getStartTime());
        reservation.setEndTime(request.getEndTime());
        reservation.setCustomer(getCustomer(request.getCustomerId()));

        return reservationMapper.toReservationResponse(
                reservationRepository.save(reservation)
        );
    }

    @Transactional
    public ReservationResponse update(Long id, UpdateReservationRequest newReservation) {
        Reservation oldReservation = getEntity(id);

        if (newReservation.getReservationDate() != null) {
            oldReservation.setReservationDate(newReservation.getReservationDate());
        }
        if (newReservation.getStartTime() != null) {
            oldReservation.setStartTime(newReservation.getStartTime());
        }
        if (newReservation.getEndTime() != null) {
            oldReservation.setEndTime(newReservation.getEndTime());
        }
        if (newReservation.getCustomerId() != null) {
            oldReservation.setCustomer(getCustomer(newReservation.getCustomerId()));
        }

        return reservationMapper.toReservationResponse(oldReservation);
    }

    public void deleteById(Long id) {
        Reservation reservation = getEntity(id);
        reservationRepository.delete(reservation);
    }

    private Reservation getEntity(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.RESERVATION_NOT_FOUND));
    }

    private Customer getCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CUSTOMER_NOT_FOUND));
    }
}