package org.example.restaurant_manager.repository;

import org.example.restaurant_manager.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByName(String name);
    boolean existsByName(String username);
    boolean existsByEmail(String email);
}
