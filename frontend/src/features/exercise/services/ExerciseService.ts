import { apiClient } from "../../../services/apiClient";
import type { SliceResponse } from "../../../types/SliceResponse";
import type { ExerciseDto } from "../types/ExerciseDto";


export const getExercises = async (pageNumber:number = 0):Promise< SliceResponse<ExerciseDto> > =>{
    const ENDPOINT_EXERCISE = import.meta.env.VITE_ENDPOINT_EXERCISE;
    const response = await apiClient.get< SliceResponse<ExerciseDto> >(
        `${ENDPOINT_EXERCISE}`,
        {
            params: pageNumber
        });

    return response.data;
};

export const getExercise = async (id:string):Promise<ExerciseDto> => {
    const ENDPOINT_EXERCISE = import.meta.env.VITE_ENDPOINT_EXERCISE;
   
    const response = await apiClient.get< ExerciseDto >(`${ENDPOINT_EXERCISE}/${id}`);

    return response.data;
};

export const deleteExercise = async(id:string) =>{
    const ENDPOINT_EXERCISE = import.meta.env.VITE_ENDPOINT_EXERCISE;
   
    const response = await apiClient.delete(`${ENDPOINT_EXERCISE}/${id}`);

    return response.data;
};

export const postExercise = async (exercise: ExerciseDto) => {
    const ENDPOINT_EXERCISE = import.meta.env.VITE_ENDPOINT_EXERCISE;
    const response = await apiClient.post(`${ENDPOINT_EXERCISE}`, exercise);

    return response.data;
};

export const patchExercise = async (exercise: ExerciseDto) => {
    const ENDPOINT_EXERCISE_PATCH = import.meta.env.VITE_ENDPOINT_EXERCISE;
    const response = await apiClient.patch(`${ENDPOINT_EXERCISE_PATCH}`, exercise);

    return response.data;
}
