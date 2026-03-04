package org.example.restaurant_manager.repository;

import org.example.restaurant_manager.model.ReservationDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservaitonDetailRepository  extends JpaRepository<ReservationDetail, Long> {
}
