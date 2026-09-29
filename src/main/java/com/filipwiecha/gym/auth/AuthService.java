package com.filipwiecha.gym.auth;

import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.user.User;
import com.filipwiecha.gym.user.UserDto;
import com.filipwiecha.gym.user.UserRepository;

@Service 
public class AuthService {
    
    
    private final UserRepository userRepository;

    public AuthService(UserRepository ur){
        this.userRepository = ur;
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
        this.userRepository.save(userToSave);
    }

}
