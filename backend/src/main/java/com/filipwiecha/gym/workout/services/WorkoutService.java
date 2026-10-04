package com.filipwiecha.gym.workout.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.exercises.models.Exercise;
import com.filipwiecha.gym.exercises.repositories.ExerciseRepository;
import com.filipwiecha.gym.user.models.User;
import com.filipwiecha.gym.user.repositories.UserRepository;
import com.filipwiecha.gym.workout.models.Workout;
import com.filipwiecha.gym.workout.models.WorkoutDto;
import com.filipwiecha.gym.workout.models.WorkoutExerciseEntry;
import com.filipwiecha.gym.workout.models.WorkoutExerciseEntryDto;
import com.filipwiecha.gym.workout.models.WorkoutMapper;
import com.filipwiecha.gym.workout.repositories.WorkoutRepository;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final ExerciseRepository exerciseRepository;
    private final WorkoutMapper workoutMapper;

    private final UserRepository userRepository;

    public WorkoutService(
        WorkoutRepository workoutRepository,
        WorkoutMapper workoutMapper,
        UserRepository userRepository,
        ExerciseRepository exerciseRepository
    ){
        this.workoutRepository = workoutRepository;
        this.workoutMapper = workoutMapper;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional(readOnly = true)
    public Workout getById(UUID workoutId){
        return this.workoutRepository.findByIdAndEnabledTrue(workoutId).orElseThrow(()-> new IllegalArgumentException("Workout not found"));
    }

    @Transactional(readOnly = true)
    public Workout getById(UUID workoutId, String username){
        return this.workoutRepository
                .findByIdAndUserIdAndEnabledTrue(workoutId, getUserByUsername(username).getId())
                .orElseThrow(()-> new IllegalArgumentException("Workout not found"));
    }

    @Transactional(readOnly = true)
    public Slice<Workout> getByUser(String username, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.workoutRepository.findByUserIdAndEnabledTrue(
            this.getUserByUsername(username).getId(),
            pageable
        );
    }

    @Transactional(readOnly = true)
    public Slice<Workout> findByName(String exerciseName, String username, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10, Sort.by("createdAt").descending());

        return this.workoutRepository
                .findByUserIdAndTitleContainingIgnoreCase(
                    this.getUserByUsername(username).getId(),
                    exerciseName,
                    pageable
                );
    }

    @Transactional
    public ValidationResult createWorkout(WorkoutDto workoutDto, String username){
        User user = this.getUserByUsername(username);
        UUID userId = user.getId();

        Workout workout = new Workout(workoutDto, user);
        
        
        if(workoutDto.getExercises() != null && !workoutDto.getExercises().isEmpty()){
            List<WorkoutExerciseEntry> wEntries = new ArrayList<>();
            for (WorkoutExerciseEntryDto wEntryDto : workoutDto.getExercises()) {
                
                Optional<Exercise> exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(wEntryDto.getExercise_id(), userId);
                if(exercise.isEmpty()) continue;
                wEntries.add(new WorkoutExerciseEntry(wEntryDto, workout, exercise.get())); 
            }

            workout.setExecutedExercises(wEntries);
        }
        
        this.workoutRepository.save(workout);

        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult disableWorkout(UUID workoutId, String username){
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, getUserByUsername(username).getId())
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        workout.setEnabled(false);

        this.workoutRepository.save(workout);

        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult updateWorkout(WorkoutDto workoutDto, String username){
        User user = this.getUserByUsername(username);
        
        Workout workout = this.workoutRepository
                    .findByIdAndUserIdAndEnabledTrue(UUID.fromString(workoutDto.getId()), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        this.workoutMapper.updateWorkoutFromDto(workoutDto, workout);
        this.workoutRepository.save(workout);

        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult addExerciseToWorkout(UUID workoutId, WorkoutExerciseEntryDto entryDto, String username) {
        User user = this.getUserByUsername(username);
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        Exercise exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(entryDto.getExercise_id(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        WorkoutExerciseEntry newEntry = new WorkoutExerciseEntry(entryDto, workout, exercise);
        workout.getExecutedExercises().add(newEntry);
        
        this.workoutRepository.save(workout);
        
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult updateWorkoutExercise(UUID workoutId, UUID entryId, WorkoutExerciseEntryDto entryDto, String username) {
        User user = this.getUserByUsername(username);
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        WorkoutExerciseEntry entryToUpdate = workout.getExecutedExercises().stream()
                .filter(entry -> entry.getId().equals(entryId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Workout entry not found"));
        
        entryToUpdate.setActualSets(entryDto.getActualSets());
        entryToUpdate.setActualReps(entryDto.getActualReps());
        
        this.workoutRepository.save(workout);
        
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult removeExerciseFromWorkout(UUID workoutId, UUID entryId, String username) {
        User user = this.getUserByUsername(username);
        
        Workout workout = this.workoutRepository.findByIdAndUserIdAndEnabledTrue(workoutId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Workout not found"));
        
        boolean removed = workout.getExecutedExercises().removeIf(entry -> entry.getId().equals(entryId));
        if (!removed) {
            throw new IllegalArgumentException("Workout entry not found");
        }
        
        this.workoutRepository.save(workout);
        
        return ValidationResult.success();
    }











    private User getUserByUsername(String username){
        return this.userRepository.findByUsername(username).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }
}
