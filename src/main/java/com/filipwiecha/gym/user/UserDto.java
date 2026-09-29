package com.filipwiecha.gym.user;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email address format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, max = 30, message = "The password must be between 8 and 30 characters long")
    private String password;

    @NotBlank(message = "Username is required")
    @Size(min = 8, max = 30, message = "The username must be between 8 and 30 characters long")
    private String username;

    
    @NotBlank(message = "First name is required")
    @Size(min = 1, max = 30, message = "The First name must be between 1 and 30 characters long")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 1, max = 30, message = "The Last name must be between 1 and 30 characters long")
    private String lastName;

    @NotNull(message = "Birth date is required")
    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;


    public UserDto(User user){
        this.username = user.getUsername();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.birthDate = user.getBirthDate();
        this.email = user.getEmail();
    }

}
