package com.filipwiecha.gym.exercises.services;

import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.exercises.models.Exercise;
import com.filipwiecha.gym.exercises.models.ExerciseDto;
import com.filipwiecha.gym.exercises.models.ExerciseMapper;
import com.filipwiecha.gym.exercises.repositories.ExerciseRepository;
import com.filipwiecha.gym.user.models.User;
import com.filipwiecha.gym.user.repositories.UserRepository;

@Service 
public class ExerciseService {
    
    private final ExerciseRepository exerciseRepository;
    private final ExerciseMapper exerciseMapper;

    private final UserRepository userRepository;

    public ExerciseService(
        ExerciseRepository exerciseRepository,
        ExerciseMapper exerciseMapper,
        UserRepository userRepository
    ){
        this.exerciseRepository = exerciseRepository;
        this.exerciseMapper = exerciseMapper;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Exercise getById(UUID exerciseId){
        return this.exerciseRepository.findByIdAndEnabledTrue(exerciseId).orElseThrow(()-> new IllegalArgumentException("Exercise not found"));
    }

    @Transactional(readOnly = true)
    public Exercise getById(UUID exerciseId, String username){
        return this.exerciseRepository
                .findByIdAndUserIdAndEnabledTrue(exerciseId, getUserByUsername(username).getId())
                .orElseThrow(()-> new IllegalArgumentException("Exercise not found"));
    }

    @Transactional(readOnly = true)
    public Slice<Exercise> getByUser(String username, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.exerciseRepository.findByUserIdAndEnabledTrue(
            this.getUserByUsername(username).getId(),
            pageable
        );
    }

    @Transactional(readOnly = true)
    public Slice<Exercise> findByName(String exerciseName, String username, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.exerciseRepository
                .findByUserIdAndNameContainingIgnoreCase(
                    this.getUserByUsername(username).getId(),
                    exerciseName,
                    pageable
                );
    }

    @Transactional
    public ValidationResult createExercise(ExerciseDto exerciseDto, String username){

        Exercise exercise = new Exercise(exerciseDto, getUserByUsername(username));
        this.exerciseRepository.save(exercise);

        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult disableWorkout(UUID exerciseId, String username){

        Exercise exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(exerciseId, getUserByUsername(username).getId()).orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        exercise.setEnabled(false);

        this.exerciseRepository.save(exercise);

        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult updateExercise(ExerciseDto exerciseDto, String username){
        User user = this.getUserByUsername(username);
        Exercise exercise = this.exerciseRepository
                    .findByIdAndUserIdAndEnabledTrue(UUID.fromString(exerciseDto.getId()), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        this.exerciseMapper.updateExerciseFromDto(exerciseDto, exercise);

        return ValidationResult.success();
    }


    private User getUserByUsername(String username){
        return this.userRepository.findByUsername(username).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }
}
