import { apiClient } from "../../../services/apiClient";
import type { SliceResponse } from "../../../types/SliceResponse";
import type { TrainingPlanDto } from "../types/TrainingPlanDto";
import type { PlanExerciseEntryDto } from "../types/PlanExerciseEntryDto";

const TRAININGPLAN_BASE = import.meta.env.VITE_ENDPOINT_TRAININGPLAN;
const PLANEXERCISE_ENDPOINT = import.meta.env.VITE_ENDPOINT_TRAININGPLAN_EXERCISE;

export const getTrainingPlans = async (pageNumber: number = 0): Promise<SliceResponse<TrainingPlanDto>> => {
    const response = await apiClient.get<SliceResponse<TrainingPlanDto>>(TRAININGPLAN_BASE, {
        params: { page: pageNumber },
        withCredentials: false
    });
    return response.data;
};

export const getTrainingPlanById = async (id: string): Promise<TrainingPlanDto> => {
    const response = await apiClient.get<TrainingPlanDto>(`${TRAININGPLAN_BASE}/${id}`, {withCredentials: false});
    return response.data;
};

export const deleteTrainingPlan = async (id: string): Promise<void> => {
    await apiClient.delete(`${TRAININGPLAN_BASE}/${id}`, {withCredentials: false});
};

export const searchTrainingPlans = async (query: string, pageNumber: number = 0): Promise<SliceResponse<TrainingPlanDto>> => {
    const SEARCH_ENDPOINT = import.meta.env.VITE_ENDPOINT_TRAININGPLAN_SEARCH;
    const response = await apiClient.get<SliceResponse<TrainingPlanDto>>(`${SEARCH_ENDPOINT}`, {
        params: { 
            query: query,
            page: pageNumber 
        },
        withCredentials: false
    });
    return response.data;
};

export const createTrainingPlan = async (plan: TrainingPlanDto): Promise<void> => {
    await apiClient.post(TRAININGPLAN_BASE, plan, {withCredentials: false});
};

export const updateTrainingPlan = async (plan: TrainingPlanDto): Promise<void> => {
    await apiClient.patch(TRAININGPLAN_BASE, plan, {withCredentials: false});
};

export const addExerciseToPlan = async (planId: string, entry: PlanExerciseEntryDto): Promise<void> => {
    await apiClient.post(`${TRAININGPLAN_BASE}/${planId}${PLANEXERCISE_ENDPOINT}`, entry, {withCredentials: false});
};

export const updatePlanExercise = async (planId: string, entryId: string, entry: PlanExerciseEntryDto): Promise<void> => {
    await apiClient.patch(`${TRAININGPLAN_BASE}/${planId}${PLANEXERCISE_ENDPOINT}/${entryId}`, entry, {withCredentials: false});
};

export const removeExerciseFromPlan = async (planId: string, entryId: string): Promise<void> => {
    await apiClient.delete(`${TRAININGPLAN_BASE}/${planId}${PLANEXERCISE_ENDPOINT}/${entryId}`, {withCredentials: false});
};