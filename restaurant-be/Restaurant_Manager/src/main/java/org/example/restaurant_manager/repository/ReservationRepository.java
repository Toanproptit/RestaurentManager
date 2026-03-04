package org.example.restaurant_manager.repository;

import org.example.restaurant_manager.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
}
