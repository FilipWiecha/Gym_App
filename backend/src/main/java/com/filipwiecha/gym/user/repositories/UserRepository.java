package com.filipwiecha.gym.user.repositories;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filipwiecha.gym.user.models.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findById(UUID userId);
    Optional<User> findByUsername(String userName);
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String userName, String email);
}
