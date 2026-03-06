package org.example.restaurant_manager.repository;

import org.example.restaurant_manager.entity.ReservationDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationDetailRepository extends JpaRepository<ReservationDetail, Long> {
}
