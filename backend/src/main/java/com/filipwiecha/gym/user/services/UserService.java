package com.filipwiecha.gym.user.services;

import java.util.UUID;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.user.models.User;
import com.filipwiecha.gym.user.models.UserMapper;
import com.filipwiecha.gym.user.models.UserUpdateDto;
import com.filipwiecha.gym.user.repositories.UserRepository;



@Service 
public class UserService {
    
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserService(
        UserRepository ur, 
        UserMapper um,
        PasswordEncoder pe
    ){
        this.userRepository = ur;
        this.userMapper = um;
        this.passwordEncoder = pe;
    }

    @Transactional(readOnly = true)
    public User getUserById(UUID userId){
        return this.userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }

    @Transactional(readOnly = true)
    public User getUserByUsername(String userName){
        return this.userRepository.findByUsername(userName).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }

    // TO DO: poprawić: dodać zmianę username i validacje czy to są już dane uzytkownika
    @Transactional
    public ValidationResult updateUserDetails(String currentUsername, UserUpdateDto userDto) {
        User userCurrent = this.userRepository.findByUsername(currentUsername)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (userDto.getEmail() != null && !userDto.getEmail().equals(userCurrent.getEmail())) {
            boolean emailExists = this.userRepository.findByEmail(userDto.getEmail()).isPresent();
            
            if (emailExists) {
                return ValidationResult.error("email", "Email is already in use");
            }
        }

        if (userDto.getNewPassword() != null) {
            if (userDto.getCurrentPassword() == null || !passwordEncoder.matches(userDto.getCurrentPassword(), userCurrent.getPassword())) {
                
                return ValidationResult.error("currentPassword","Passwords does not match");
            }
            userCurrent.setPassword(passwordEncoder.encode(userDto.getNewPassword()));
        }

        if(userDto.equalsWithUser(userCurrent)){
            return ValidationResult.error("global","This is your data already");
        }

        userMapper.updateUserFromDto(userDto, userCurrent);

        return ValidationResult.success();
    }
}
