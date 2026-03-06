package org.example.restaurant_manager.repository;

import org.example.restaurant_manager.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
