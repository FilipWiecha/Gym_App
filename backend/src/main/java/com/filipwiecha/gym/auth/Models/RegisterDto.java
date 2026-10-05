package com.filipwiecha.gym.auth.models;

import com.filipwiecha.gym.user.models.UserDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor 
public class RegisterDto extends UserDto {
    
    @NotBlank(message = "Hasło jest wymagane")
    @Size(min = 8, message = "Hasło musi mieć min. 8 znaków")
    @Size(max = 64, message = "Hasło może mieć maks. 64 znaki")
    @Pattern(regexp = "^.*[a-z].*$", message = "Hasło musi zawierać małą literę")
    @Pattern(regexp = "^.*[A-Z].*$", message = "Hasło musi zawierać wielką literę")
    @Pattern(regexp = "^.*\\d.*$", message = "Hasło musi zawierać cyfrę")
    private String password;

}
