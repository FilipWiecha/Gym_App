package com.filipwiecha.gym.user.models;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDto {
    
    @Email(message = "Invalid email address format")
    private String email;

    @Size(min = 1, max = 30, message = "The First name must be between 1 and 30 characters long")
    private String firstName;

    @Size(min = 1, max = 30, message = "The Last name must be between 1 and 30 characters long")
    private String lastName;

    private String currentPassword;
    
    @Size(min = 8, max = 255, message = "The new password must be between 1 and 255 characters long")
    private String newPassword;
  
    
    public boolean equalsWithUser(User dto){
        
        if(
            this.email != null && 
            dto.getEmail() != null &&
            !this.email.equals(dto.getEmail())
        ){
            return false;
        }

        if(
            this.firstName != null && 
            dto.getLastName() != null &&
            !this.firstName.equals(dto.getFirstName())
        ){
            return false;
        }

        if(
            this.lastName != null && 
            dto.getLastName() != null &&
            !this.email.equals(dto.getLastName())
        ){
            return false;
        }

        return true;
    }
}
