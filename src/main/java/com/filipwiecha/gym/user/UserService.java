package com.filipwiecha.gym.user;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;



@Service 
public class UserService {
    
    private final UserRepository userRepository;

    public UserService(UserRepository ur){
        this.userRepository = ur;
    }

    @Transactional(readOnly = true)
    public User getUser(UUID userId){
        return this.userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("user not found"));
    }
}
