import { apiClient } from "../../../services/apiClient";
import type { SliceResponse } from "../../../types/SliceResponse";
import type { WorkoutDto } from "../types/WorkoutDto";
import type { WorkoutExerciseEntryDto } from "../types/WorkoutExerciseEntryDto";

const WORKOUT_BASE = import.meta.env.VITE_ENDPOINT_WORKOUT;
const WORKOUT_EXERCISE_ENDPOINT = import.meta.env.VITE_ENDPOINT_WORKOUT_EXERCISE;

export const getWorkouts = async (pageNumber: number = 0): Promise<SliceResponse<WorkoutDto>> => {
    const response = await apiClient.get<SliceResponse<WorkoutDto>>(WORKOUT_BASE, {
        params: { page: pageNumber }
    });
    return response.data;
};

export const getWorkoutById = async (id: string): Promise<WorkoutDto> => {
    const response = await apiClient.get<WorkoutDto>(`${WORKOUT_BASE}/${id}`);
    return response.data;
};

export const deleteWorkout = async (id: string): Promise<void> => {
    await apiClient.delete(`${WORKOUT_BASE}/${id}`);
};

export const searchWorkouts = async (query: string, pageNumber: number = 0): Promise<SliceResponse<WorkoutDto>> => {
    const WORKOUT_SEARCH_ENDOINT = import.meta.env.VITE_ENDPOINT_WORKOUT_SEARCH;
    
    const response = await apiClient.get<SliceResponse<WorkoutDto>>(`${WORKOUT_SEARCH_ENDOINT}`, {
        params: { 
            query: query,
            page: pageNumber 
        }
    });
    return response.data;
};

export const createWorkout = async (workout: WorkoutDto): Promise<void> => {
    await apiClient.post(WORKOUT_BASE, workout);
};

export const updateWorkout = async (workout: WorkoutDto): Promise<void> => {
    await apiClient.patch(WORKOUT_BASE, workout);
};
//${WORKOUT_EXERCISE_ENDPOINT}
export const addExerciseToWorkout = async (workoutId: string, entry: WorkoutExerciseEntryDto): Promise<void> => {
    await apiClient.post(`${WORKOUT_BASE}/${workoutId}${WORKOUT_EXERCISE_ENDPOINT}`, entry);
};

export const updateWorkoutExercise = async (workoutId: string, entryId: string, entry: WorkoutExerciseEntryDto): Promise<void> => {
    await apiClient.patch(`${WORKOUT_BASE}/${workoutId}${WORKOUT_EXERCISE_ENDPOINT}/${entryId}`, entry);
};

export const removeExerciseFromWorkout = async (workoutId: string, entryId: string): Promise<void> => {
    await apiClient.delete(`${WORKOUT_BASE}/${workoutId}${WORKOUT_EXERCISE_ENDPOINT}/${entryId}`);
};