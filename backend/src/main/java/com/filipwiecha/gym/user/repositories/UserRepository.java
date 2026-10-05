package com.filipwiecha.gym.user.repositories;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.filipwiecha.gym.user.models.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    
    Optional<User> findById(UUID userId);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    //Max dwa rekordy
    List<User> findByUsernameOrEmail(String userName, String email);
}
