package com.filipwiecha.gym.exercises.models;

import java.util.UUID;

import com.filipwiecha.gym.user.models.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "exercises")

@Data
@AllArgsConstructor
@NoArgsConstructor 
public class Exercise {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 200)
    private String description;

    private boolean enabled;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
