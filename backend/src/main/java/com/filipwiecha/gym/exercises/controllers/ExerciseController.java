package com.filipwiecha.gym.exercises.controllers;


import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.exercises.models.ExerciseDto;
import com.filipwiecha.gym.exercises.services.ExerciseService;


import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("exercise")
@Validated
public class ExerciseController {
    
    private final ExerciseService exerciseService;

    public ExerciseController(ExerciseService exerciseService){
        this.exerciseService = exerciseService;
    }

    @GetMapping()
    public ResponseEntity<?> getAllExercises(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    ExerciseDto.toSlice(
                        this.exerciseService.getByUser(jwt.getSubject(), pageNumber)
                    )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExerciseDto> getExercise(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID exerciseId
    ){

        return ResponseEntity.status(HttpStatus.OK).body(
                new ExerciseDto(this.exerciseService.getById(exerciseId,jwt.getSubject()))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExercise(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID exerciseId
    ){
        ValidationResult valid = this.exerciseService.disableWorkout(exerciseId, jwt.getSubject());

        return valid.response(null, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> findExercises(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam("query") String query,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    ExerciseDto.toSlice(
                        this.exerciseService.findByName(query, jwt.getSubject(), pageNumber)
                    )
                );
    }

    // TO DO: sprawdzic te validationResult czy to potrzebne
    @PostMapping()
    public ResponseEntity<?> createExercise(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody ExerciseDto exerciseDto
    ){

        ValidationResult valid = this.exerciseService.createExercise(exerciseDto, jwt.getSubject());

        return valid.response(null, HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<?> patchExercise(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody ExerciseDto exerciseDto
    ){
        ValidationResult valid = this.exerciseService.updateExercise(exerciseDto, jwt.getSubject());

        return valid.response(null, HttpStatus.OK);
    }
}
