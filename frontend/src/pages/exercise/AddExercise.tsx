import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


import { useApiValidation } from "../../hooks/useApiValidation";
import { postExercise } from "../../features/exercise/services/ExerciseService";
import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";


export function AddExercisePage(){

    const navigate = useNavigate();

    const [exercise,setExercise] = useState<ExerciseDto>({
        id: '231231asdasd',
        name: '',
        description: '',
    })

    const { fieldErrors, handleApiError, clearErrors } = useApiValidation();
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExercise({
            ...exercise,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            setStatus({ type: null, message: '' });
            clearErrors();
    
            const payload: Partial<ExerciseDto> = { ...exercise };
            (Object.keys(payload) as (keyof ExerciseDto)[]).forEach(key => {
                if (payload[key] === "") {
                    delete payload[key];
                }
            });
    
            try {
                await postExercise(payload as ExerciseDto);
                navigate('/exercise');
                
            } catch (error: any) {
                await handleApiError(error);
                setStatus({ type: 'error', message: fieldErrors?.global || 'Data not updated' });
            }
    };

    return(
        <>
            <p> Add exercise page </p>

            <p>
                Back to
                <Link to="/exercise">Exercises</Link>
            </p>
            

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name"> Name: </label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        onChange={handleChange}
                    />

                    <label htmlFor="name"> Desciption: </label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        onChange={handleChange}
                    />
                </div>

                <button type="submit">
                    Save changes
                </button>
            </form>
        </>
    );
};