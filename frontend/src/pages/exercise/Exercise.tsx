import { useEffect, useState } from "react";

import { getExercises } from "../../features/exercise/services/ExerciseService";
import { Link } from "react-router-dom";
import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";
import type { SliceResponse } from "../../types/SliceResponse";

export function ExercisePage(){

    const [exercise, setExercise] = useState<SliceResponse<ExerciseDto> | null>(null);
    
    const [isLoading,setIsLoading] = useState<boolean>(true);
    const [result, setResult] = useState<{isSuccess:boolean, message:string | null}>({
        isSuccess: true,
        message: null
    });

    useEffect(()=>{

        const getUserExercises = async () =>{
            setIsLoading(true);

            try{
                const exercisesData = await getExercises();

                setExercise(exercisesData);
                setResult({
                    isSuccess:true,
                    message:null
                });
                
            }catch{
                setResult({
                    isSuccess:false,
                    message:'An error ocured while getting data'
                });
            }finally{
                setIsLoading(false);
            }
        };

        getUserExercises();

    }, [])

    if(isLoading){
        return(
            <p>Loading...</p>
        );
    }

    const ExerciseList = ({}) =>{
        const exerciseMap = exercise?.content.map(exer => 
            <ul key={exer.id}>
                <li>Name: {exer.name}</li>
                
                <Link to="/exercise/detail" state={{exercise: exer}}>Details</Link>
            </ul>
        );

        return exerciseMap;
    };

    return(
        <>
            {!exercise?.content.length && (
                <div>
                    <p>
                        You dont have any exercises
                    </p>
                </div>
            )}

            <Link to="/exercise/new">
                Add exercise
            </Link>

            {result?.isSuccess ? (
                
                <ExerciseList />
            ):(
                <p>Error: {result?.message}</p>
            )}
            
        </>
    );
};