package com.filipwiecha.gym.user.Service;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.user.UserRepository;
import com.filipwiecha.gym.user.Models.User;



@Service 
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository ur){
        this.userRepository = ur;
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID userId){
        return this.userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String userName){
        return this.userRepository.findByUsername(userName).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }
}
