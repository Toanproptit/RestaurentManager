package org.example.restaurant_manager.repository;

import org.example.restaurant_manager.entity.DiningTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiningTableRepository extends JpaRepository<DiningTable, Long> {
    long countByStatus(String status);
}
