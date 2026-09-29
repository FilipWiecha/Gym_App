package com.filipwiecha.gym.user;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findById(UUID userId);
    Optional<User> findByUsername(String userName);
    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameAndEmail(String userName, String email);
}
