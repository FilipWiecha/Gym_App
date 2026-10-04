import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { searchExercises, getExercises } from "../../features/exercise/services/ExerciseService";
import type { ExerciseDto } from "../../features/exercise/types/ExerciseDto";

interface ExerciseSelectorProps {
    onSelect: (exercise: ExerciseDto) => void;
}

export function ExerciseSelector({ onSelect }: ExerciseSelectorProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<ExerciseDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const timeout = 500;

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const data = query 
                    ? await searchExercises(query, 0) 
                    : await getExercises(0);
                setResults(data.content);
            } catch (error) {
                console.error("Błąd wyszukiwania ćwiczeń", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        const delayDebounce = setTimeout(() => { fetchResults(); }, timeout);
        return () => clearTimeout(delayDebounce);
    }, [query, timeout]);

    return (
        <div style={{ marginBottom: '24px' }}>
            <div className="input-with-icon" style={{ marginBottom: '12px' }}>
                <Search className="icon-left" size={18} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Szukaj ćwiczenia do dodania..."
                />
            </div>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px' }}>
                {isLoading ? (
                    <p style={{ padding: '12px', fontSize: '14px', margin: 0 }}>Szukanie...</p>
                ) : results.length === 0 ? (
                    <p style={{ padding: '12px', fontSize: '14px', margin: 0 }}>Brak wyników.</p>
                ) : (
                    results.map(ex => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid var(--color-border)' }}>
                            <span style={{ fontSize: '14px', fontWeight: 500 }}>{ex.name}</span>
                            <button 
                                type="button" 
                                onClick={() => onSelect(ex)}
                                className="btn-secondary"
                                style={{ padding: '6px 12px', fontSize: '12px' }}
                            >
                                <Plus size={14} /> Wybierz
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}