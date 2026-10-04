import { useState } from "react";
import { useSlicePagination } from "../../hooks/useSlicePagination";
import { SearchBar } from "../../components/common/SearchBar";
import { PaginationControls } from "../../components/common/PaginationControls";
import { useFetchTrainingPlans } from "../../features/trainingplan/hooks/useFetchTrainingPlans";
import { deleteTrainingPlan } from "../../features/trainingplan/services/TrainingPlanService";
import { TrainingPlanCard } from "../../features/trainingplan/components/TrainingPlanCard";
import { AddButton } from "../../components/common/Buttons";
import { ConfirmModal } from "../../components/common/ConfirmModal";
import { PageLayout } from "../../components/layout/PageLayout";

export function TrainingPlanListPage() {
    const { 
        currentPage, searchQuery, hasNext, setHasNext, 
        nextPage, prevPage, hasPrev, updateSearch, backUrlSearch 
    } = useSlicePagination();

    const { plans, isLoading, error, refetch } = useFetchTrainingPlans(searchQuery, currentPage, setHasNext);
    
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await deleteTrainingPlan(deleteId);
            refetch();
        } catch (err) {
            console.error("Błąd usuwania", err);
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <PageLayout>
            <div className="top-nav">
                <div className="form-header" style={{ margin: 0 }}>
                    <h2 style={{ margin: 0 }}>Plany Treningowe</h2>
                </div>

                <AddButton to="/trainingplan/new" text="" />
            </div>

            <div className="bottom-nav">

                <div className="add-btn-nav">
                    
                </div>

                <SearchBar
                    initialValue={searchQuery} 
                    onSearch={updateSearch} 
                    placeholder="Szukaj planu po tytule..." 
                />

            </div>


            {isLoading && <p>Ładowanie...</p>}
            {error && <div className="error-message">{error}</div>}

            {!isLoading && plans.length === 0 && !error && (
                <p>Brak planów. Utwórz swój pierwszy plan.</p>
            )}

            <div className="card-grid">
                {plans.map(plan => (
                    <TrainingPlanCard 
                        key={plan.id} 
                        plan={plan} 
                        backUrlSearch={backUrlSearch} 
                        onDelete={setDeleteId}
                    />
                ))}
            </div>

            <PaginationControls 
                onPrev={prevPage} 
                onNext={nextPage} 
                disablePrev={!hasPrev} 
                disableNext={!hasNext} 
            />

            <ConfirmModal 
                isOpen={!!deleteId}
                title="Usuwanie planu"
                message="Czy na pewno chcesz usunąć ten plan? Operacji nie można cofnąć."
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
                isLoading={isDeleting}
            />
        </PageLayout>
    );
}