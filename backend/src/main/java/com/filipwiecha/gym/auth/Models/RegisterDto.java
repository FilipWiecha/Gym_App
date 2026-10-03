package com.filipwiecha.gym.auth.models;

import com.filipwiecha.gym.user.models.UserDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor 
public class RegisterDto extends UserDto {
    
    @NotBlank(message = "Username is required")
    @Size(min = 8, max = 30, message = "The username must be between 8 and 30 characters long")
    private String password;

}
