import { useLocation, useNavigate } from "react-router-dom";

import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";
import { useState } from "react";
import { useApiValidation } from "../../hooks/useApiValidation";
import { deleteExercise, getExercise, patchExercise } from "../../features/exercise/services/ExerciseService";



export function DetailsExercise(){
    const navigation = useNavigate();
    const location = useLocation();
    const [exercise,setExercise] = useState<ExerciseDto | undefined>(location.state?.exercise as ExerciseDto | undefined);

    const [exerciseUpdated,setExerciseUpdated] = useState<ExerciseDto>({
        id: location.state?.exercise?.id || "",
        name:"",
        description:"",
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
    const { fieldErrors, handleApiError, clearErrors } = useApiValidation();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExerciseUpdated({
            ...exerciseUpdated,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setStatus({ type: null, message: '' });
            clearErrors();
    
            const payload: Partial<ExerciseDto> = { ...exerciseUpdated };
            (Object.keys(payload) as (keyof ExerciseDto)[]).forEach(key => {
                if (payload[key] === "") {
                    delete payload[key];
                }
            });
    
            try {
                await patchExercise(payload as ExerciseDto);
                const updated = await getExercise(exerciseUpdated.id as string);
                setExercise(updated);
                
                setStatus({ type: 'success', message: 'All changes saved' });
            } catch (error: any) {
                await handleApiError(error);
                setStatus({ type: 'error', message: fieldErrors?.global || 'Data not updated' });
            }
    };

    const handleDelete = async () =>{
        try{
            await deleteExercise(exercise?.id as string);
            navigation('/exercise');
        }catch{

        }
    };

    return(
        <>
            <button onClick={()=>{navigation("/exercise")}}>Back</button>
            
            {exercise ? (
                <>
                    <p>Details</p>
                    <p>Name: {exercise.name}</p>
                    <p>description: {exercise.description}</p>
                    <p>id: {exercise.id}</p>

                    <form>
                        <input 
                            id="name"
                            name="name"
                            type="text"
                            onChange={handleChange}
                        />

                        <input 
                            id="description"
                            name="description"
                            type="text"
                            onChange={handleChange}
                        />

                        <button onClick={handleSubmit}> Zapisz </button>
                    </form>

                    <button onClick={handleDelete}> Usuń </button>
                </>
            ) : (
                
                <p>Brak danych ćwiczenia</p>
            )}

        </>
    )
};