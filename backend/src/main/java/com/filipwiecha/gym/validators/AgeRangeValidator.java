package com.filipwiecha.gym.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
 
import java.time.LocalDate;
import java.time.Period;
 
public class AgeRangeValidator implements ConstraintValidator<AgeRange, LocalDate> {
 
    private int min;
    private int max;
 
    @Override
    public void initialize(AgeRange annotation) {
        this.min = annotation.min();
        this.max = annotation.max();
    }
 
    @Override
    public boolean isValid(LocalDate birthDate, ConstraintValidatorContext context) {
        LocalDate today = LocalDate.now();
 
        // null obsługuje @NotNull, przyszłość obsługuje @Past
        if (birthDate == null || !birthDate.isBefore(today)) {
            return true;
        }
 
        int age = Period.between(birthDate, today).getYears();
 
        if (age < min) {
            return fail(context, "Musisz mieć co najmniej " + min + " lat");
        }
        if (age > max) {
            return fail(context, "Podaj poprawną datę urodzenia");
        }
        return true;
    }
 
    private boolean fail(ConstraintValidatorContext context, String message) {
        context.disableDefaultConstraintViolation();
        context.buildConstraintViolationWithTemplate(message).addConstraintViolation();
        return false;
    }
}
