package com.filipwiecha.gym.config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.ResponseEntity;

public record ValidationResult(boolean isValid, Map<String, String> errors) {

    public static ValidationResult success() {
        return new ValidationResult(true, new HashMap<>());
    }

    public static ValidationResult error(String field, String message) {
        return new ValidationResult(false, Map.of(field, message));
    } 

    public ResponseEntity<?> response(Object data, HttpStatus httpStatus){

        if(!this.isValid){
            ProblemDetail pd = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, "Validation error");
            pd.setProperty("errors", this.errors());
            
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(pd);
        }

        return ResponseEntity.status(httpStatus).body(data);
    }

}
