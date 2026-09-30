package com.filipwiecha.gym.auth;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.auth.Models.RegisterDto;
import com.filipwiecha.gym.user.UserRepository;
import com.filipwiecha.gym.user.Models.User;

@Service 
public class AuthService {
    
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository ur, PasswordEncoder pe){
        this.userRepository = ur;
        this.passwordEncoder = pe;
    }


    @Transactional
    public void createUser(RegisterDto registerDto){
        Optional<User> userToCheck = this.userRepository.findByUsernameOrEmail(registerDto.getUsername(), registerDto.getEmail());
        
        if(userToCheck.isPresent()){
            if(userToCheck.get().getUsername().equals(registerDto.getUsername())){
                throw new IllegalArgumentException("Username is already in use");
            }

            throw new IllegalArgumentException("Email is already in use");
        }

        User userToSave = new User(registerDto);
        userToSave.setPassword(this.passwordEncoder.encode(registerDto.getPassword()));
        this.userRepository.save(userToSave);
    }

}
