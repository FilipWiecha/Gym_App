package com.filipwiecha.gym.auth;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.user.UserRepository;
import com.filipwiecha.gym.user.Models.User;
import com.filipwiecha.gym.user.Models.UserDto;

@Service 
public class AuthService {
    
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository ur, PasswordEncoder pe){
        this.userRepository = ur;
        this.passwordEncoder = pe;
    }


    @Transactional
    public void createUser(UserDto userDto){
        Optional<User> userToCheck = this.userRepository.findByUsernameAndEmail(userDto.getUsername(), userDto.getEmail());
        
        if(userToCheck.isPresent()){
            if(userToCheck.get().getUsername().equals(userDto.getUsername())){
                throw new IllegalArgumentException("Username is already in use");
            }

            throw new IllegalArgumentException("Email is already in use");
        }

        User userToSave = new User(userDto);
        userToSave.setPassword(this.passwordEncoder.encode(userDto.getPassword()));
        this.userRepository.save(userToSave);
    }

}
