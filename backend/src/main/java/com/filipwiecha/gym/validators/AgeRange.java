package com.filipwiecha.gym.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
 
import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
 
@Documented
@Constraint(validatedBy = AgeRangeValidator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER, ElementType.RECORD_COMPONENT})
@Retention(RetentionPolicy.RUNTIME)
public @interface AgeRange {
 
    String message() default "Niepoprawny wiek";
 
    int min() default 13;
 
    int max() default 120;
 
    Class<?>[] groups() default {};
 
    Class<? extends Payload>[] payload() default {};
}
