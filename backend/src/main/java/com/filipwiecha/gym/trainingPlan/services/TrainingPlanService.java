package com.filipwiecha.gym.trainingPlan.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.filipwiecha.gym.config.ValidationResult;
import com.filipwiecha.gym.exercises.models.Exercise;
import com.filipwiecha.gym.exercises.repositories.ExerciseRepository;
import com.filipwiecha.gym.trainingPlan.models.PlanExerciseEntry;
import com.filipwiecha.gym.trainingPlan.models.PlanExerciseEntryDto;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlan;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlanDto;
import com.filipwiecha.gym.trainingPlan.models.TrainingPlanMapper;
import com.filipwiecha.gym.trainingPlan.repositories.TrainingPlanRepository;
import com.filipwiecha.gym.user.models.User;
import com.filipwiecha.gym.user.repositories.UserRepository;

@Service
public class TrainingPlanService {

    private final TrainingPlanRepository trainingPlanRepository;
    private final ExerciseRepository exerciseRepository;
    private final TrainingPlanMapper trainingPlanMapper;
    private final UserRepository userRepository;

    public TrainingPlanService(
        TrainingPlanRepository trainingPlanRepository,
        TrainingPlanMapper trainingPlanMapper,
        UserRepository userRepository,
        ExerciseRepository exerciseRepository
    ){
        this.trainingPlanRepository = trainingPlanRepository;
        this.trainingPlanMapper = trainingPlanMapper;
        this.userRepository = userRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional(readOnly = true)
    public TrainingPlan getById(UUID planId, String username){
        return this.trainingPlanRepository
                .findByIdAndUserIdAndEnabledTrue(planId, getUserByUsername(username).getId())
                .orElseThrow(()-> new IllegalArgumentException("Training plan not found"));
    }

    @Transactional(readOnly = true)
    public Slice<TrainingPlan> getByUser(String username, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10);
        return this.trainingPlanRepository.findByUserIdAndEnabledTrue(
            this.getUserByUsername(username).getId(),
            pageable
        );
    }

    @Transactional(readOnly = true)
    public Slice<TrainingPlan> findByName(String query, String username, int pageNumber){
        Pageable pageable = PageRequest.of(pageNumber, 10);
        return this.trainingPlanRepository
                .findByUserIdAndTitleContainingIgnoreCase(
                    this.getUserByUsername(username).getId(),
                    query,
                    pageable
                );
    }

    @Transactional
    public ValidationResult createTrainingPlan(TrainingPlanDto dto, String username){
        User user = this.getUserByUsername(username);
        
        TrainingPlan plan = new TrainingPlan();
        plan.setTitle(dto.getTitle());
        plan.setDescription(dto.getDescription());
        plan.setEnabled(true);
        plan.setUser(user);

        if(dto.getExercises() != null && !dto.getExercises().isEmpty()){
            List<PlanExerciseEntry> entries = new ArrayList<>();
            for (PlanExerciseEntryDto entryDto : dto.getExercises()) {
                Optional<Exercise> exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(entryDto.getExercise_id(), user.getId());
                if(exercise.isEmpty()) continue;
                
                PlanExerciseEntry newEntry = new PlanExerciseEntry();
                newEntry.setTargetSets(entryDto.getTargetSets());
                newEntry.setTargetReps(entryDto.getTargetReps());
                newEntry.setTrainingPlan(plan);
                newEntry.setExercise(exercise.get());
                
                entries.add(newEntry);
            }
            plan.setPlannedExercises(entries);
        }
        
        this.trainingPlanRepository.save(plan);
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult disableTrainingPlan(UUID planId, String username){
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, getUserByUsername(username).getId())
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        plan.setEnabled(false);
        this.trainingPlanRepository.save(plan);
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult updateTrainingPlan(TrainingPlanDto dto, String username){
        User user = this.getUserByUsername(username);
        TrainingPlan plan = this.trainingPlanRepository
                    .findByIdAndUserIdAndEnabledTrue(UUID.fromString(dto.getId()), user.getId())
                    .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        this.trainingPlanMapper.updateTrainingPlanFromDto(dto, plan);
        this.trainingPlanRepository.save(plan);
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult addExerciseToPlan(UUID planId, PlanExerciseEntryDto entryDto, String username) {
        User user = this.getUserByUsername(username);
        
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        Exercise exercise = this.exerciseRepository.findByIdAndUserIdAndEnabledTrue(entryDto.getExercise_id(), user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));
        
        PlanExerciseEntry newEntry = new PlanExerciseEntry();
        newEntry.setTargetSets(entryDto.getTargetSets());
        newEntry.setTargetReps(entryDto.getTargetReps());
        newEntry.setTrainingPlan(plan);
        newEntry.setExercise(exercise);
        
        plan.getPlannedExercises().add(newEntry);
        this.trainingPlanRepository.save(plan);
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult updatePlanExercise(UUID planId, UUID entryId, PlanExerciseEntryDto entryDto, String username) {
        User user = this.getUserByUsername(username);
        
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        PlanExerciseEntry entryToUpdate = plan.getPlannedExercises().stream()
                .filter(entry -> entry.getId().equals(entryId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Plan entry not found"));
        
        entryToUpdate.setTargetSets(entryDto.getTargetSets());
        entryToUpdate.setTargetReps(entryDto.getTargetReps());
        
        this.trainingPlanRepository.save(plan);
        return ValidationResult.success();
    }

    @Transactional
    public ValidationResult removeExerciseFromPlan(UUID planId, UUID entryId, String username) {
        User user = this.getUserByUsername(username);
        
        TrainingPlan plan = this.trainingPlanRepository.findByIdAndUserIdAndEnabledTrue(planId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Training plan not found"));
        
        boolean removed = plan.getPlannedExercises().removeIf(entry -> entry.getId().equals(entryId));
        if (!removed) {
            throw new IllegalArgumentException("Plan entry not found");
        }
        
        this.trainingPlanRepository.save(plan);
        return ValidationResult.success();
    }

    private User getUserByUsername(String username){
        return this.userRepository.findByUsername(username).orElseThrow(()-> new IllegalArgumentException("User not found"));
    }
}