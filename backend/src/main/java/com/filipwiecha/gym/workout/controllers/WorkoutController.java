package com.filipwiecha.gym.workout.controllers;

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
import com.filipwiecha.gym.workout.models.WorkoutDto;
import com.filipwiecha.gym.workout.models.WorkoutExerciseEntryDto;
import com.filipwiecha.gym.workout.services.WorkoutService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@RestController
@RequestMapping("workout")
@Validated
public class WorkoutController {
    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService){
        this.workoutService = workoutService;
    }

    @GetMapping()
    public ResponseEntity<?> getAllWorkouts(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    WorkoutDto.toSlice(
                        this.workoutService.getByUser(jwt.getSubject(), pageNumber)
                    )
                );
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkoutDto> getWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId
    ){

        return ResponseEntity.status(HttpStatus.OK).body(
                new WorkoutDto(this.workoutService.getById(workoutId, jwt.getSubject()))
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId
    ){
        ValidationResult valid = this.workoutService.disableWorkout(workoutId, jwt.getSubject());

        return valid.response(null, HttpStatus.OK);
    }

    @GetMapping("/search")
    public ResponseEntity<?> findWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @RequestParam("query") String query,
        @RequestParam(name = "page", required = false, defaultValue = "0") @Min(0) @Max(100) int pageNumber
    ){
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(
                    WorkoutDto.toSlice(
                        this.workoutService.findByName(query, jwt.getSubject(), pageNumber)
                    )
                );
    }

    // TO DO: sprawdzic te validationResult czy to potrzebne
    @PostMapping()
    public ResponseEntity<?> createWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody WorkoutDto workoutDto
    ){

        ValidationResult valid = this.workoutService.createWorkout(workoutDto, jwt.getSubject());

        return valid.response(null, HttpStatus.OK);
    }

    @PatchMapping()
    public ResponseEntity<?> patchWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody WorkoutDto workoutDto
    ){
        ValidationResult valid = this.workoutService.updateWorkout(workoutDto, jwt.getSubject());

        return valid.response(null, HttpStatus.OK);
    }

    @PostMapping("/{id}/exercises")
    public ResponseEntity<?> addExerciseToWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId,
        @Valid @RequestBody WorkoutExerciseEntryDto entryDto
    ) {
        ValidationResult valid = this.workoutService.addExerciseToWorkout(workoutId, entryDto, jwt.getSubject());
        return valid.response(null, HttpStatus.OK);
    }

    @PatchMapping("/{id}/exercises/{entryId}")
    public ResponseEntity<?> updateWorkoutExercise(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId,
        @PathVariable("entryId") UUID entryId,
        @Valid @RequestBody WorkoutExerciseEntryDto entryDto
    ) {
        ValidationResult valid = this.workoutService.updateWorkoutExercise(workoutId, entryId, entryDto, jwt.getSubject());
        return valid.response(null, HttpStatus.OK);
    }

    @DeleteMapping("/{id}/exercises/{entryId}")
    public ResponseEntity<?> removeExerciseFromWorkout(
        @AuthenticationPrincipal Jwt jwt,
        @PathVariable("id") UUID workoutId,
        @PathVariable("entryId") UUID entryId
    ) {
        ValidationResult valid = this.workoutService.removeExerciseFromWorkout(workoutId, entryId, jwt.getSubject());
        return valid.response(null, HttpStatus.OK);
    }
}
