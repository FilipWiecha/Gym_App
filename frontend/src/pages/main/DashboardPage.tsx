import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Activity, ChevronRight, ClipboardList, Dumbbell } from "lucide-react";

import { PageLayout } from "../../components/layout/PageLayout";
import { getWorkouts } from "../../features/workout/services/WorkoutService";
import { getTrainingPlans } from "../../features/trainingplan/services/TrainingPlanService";
import type { WorkoutDto } from "../../features/workout/types/WorkoutDto";
import type { TrainingPlanDto } from "../../features/trainingplan/types/TrainingPlanDto";

import styles from "./DashboardPage.module.css";
import { useAuth } from "../../context/AuthContext";

const RECENT_WORKOUTS = 5;
const PLANS_PREVIEW = 4;

const QUICK_ACTIONS = [
    { to: "/workout/new", icon: Activity, title: "Nowy trening", text: "Zapisz wykonane ćwiczenia" },
    { to: "/trainingplan/new", icon: ClipboardList, title: "Nowy plan", text: "Zaplanuj serie i powtórzenia" },
    { to: "/exercise/new", icon: Dumbbell, title: "Nowe ćwiczenie", text: "Dodaj do swojej biblioteki" },
];

const timestamp = (w: WorkoutDto) => (w.startDate ? new Date(w.startDate).getTime() : 0);

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Dzień dobry";
    if (hour < 18) return "Cześć";
    return "Dobry wieczór";
};

const formatToday = () => {
    const text = new Date().toLocaleDateString("pl-PL", { weekday: "long", day: "numeric", month: "long" });
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export function DashboardPage() {
    const {user} = useAuth();
    const firstName = user?.firstName || "";
    const [workouts, setWorkouts] = useState<WorkoutDto[]>([]);
    const [plans, setPlans] = useState<TrainingPlanDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            // allSettled: awaria jednej sekcji nie blokuje pozostałych
            const [ workoutsRes, plansRes] = await Promise.allSettled([

                getWorkouts(0),
                getTrainingPlans(0),
            ]);
            if (cancelled) return;

            if (workoutsRes.status === "fulfilled") setWorkouts(workoutsRes.value.content);
            if (plansRes.status === "fulfilled") setPlans(plansRes.value.content);
            if (workoutsRes.status === "rejected" && plansRes.status === "rejected") {
                setError("Nie udało się wczytać danych. Odśwież stronę.");
            }
            setIsLoading(false);
        })();

        return () => { cancelled = true; };
    }, []);

    const recentWorkouts = useMemo(
        () => [...workouts].sort((a, b) => timestamp(b) - timestamp(a)).slice(0, RECENT_WORKOUTS),
        [workouts]
    );

    return (
        <PageLayout>
            <div className="top-nav">
                <div className="form-header">
                    <h2>{getGreeting()}{firstName ? `, ${firstName}` : ""}</h2>
                    <p>{formatToday()}</p>
                </div>
            </div>

            <div className={styles.content}>
                {error && <div className="error-message">{error}</div>}

                <div className={styles.actions}>
                    {QUICK_ACTIONS.map(({ to, icon: Icon, title, text }) => (
                        <Link key={to} to={to} className={styles.tile}>
                            <span className={styles.tileIcon}><Icon size={20} strokeWidth={1.75} /></span>
                            <span className={styles.tileBody}>
                                <p className={styles.tileTitle}>{title}</p>
                                <p className={styles.tileText}>{text}</p>
                            </span>
                            <ChevronRight className={styles.chevron} size={18} />
                        </Link>
                    ))}
                </div>

                <div className={styles.columns}>
                    <section className={styles.panel}>
                        <div className={styles.panelHead}>
                            <h3 className={styles.panelTitle}>Ostatnie treningi</h3>
                            <Link to="/workout" className={styles.seeAll}>Wszystkie</Link>
                        </div>

                        {isLoading && <p className={styles.empty}>Ładowanie...</p>}

                        {!isLoading && recentWorkouts.length === 0 && (
                            <div className={styles.empty}>
                                <p>Nie masz jeszcze żadnych treningów.</p>
                                <Link to="/workout/new" className={`btn-primary ${styles.emptyAction}`}>
                                    Dodaj pierwszy trening
                                </Link>
                            </div>
                        )}

                        {recentWorkouts.map(workout => {
                            const date = workout.startDate ? new Date(workout.startDate) : null;
                            return (
                                <Link
                                    key={workout.id}
                                    to={`/workout/${workout.id}`}
                                    state={{ workout, search: "" }}
                                    className={styles.row}
                                >
                                    <span className={styles.chip}>
                                        {date ? (
                                            <>
                                                <span className={styles.chipMonth}>
                                                    {date.toLocaleDateString("pl-PL", { month: "short" }).replace(".", "")}
                                                </span>
                                                <span className={styles.chipDay}>{date.getDate()}</span>
                                            </>
                                        ) : (
                                            <Activity size={18} />
                                        )}
                                    </span>
                                    <span className={styles.rowMain}>
                                        <p className={styles.rowTitle}>{workout.title}</p>
                                        <p className={styles.rowMeta}>
                                            {date
                                                ? date.toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
                                                : "Brak daty"}
                                            {workout.description ? ` • ${workout.description}` : ""}
                                        </p>
                                    </span>
                                    <ChevronRight className={styles.chevron} size={16} />
                                </Link>
                            );
                        })}
                    </section>

                    <section className={styles.panel}>
                        <div className={styles.panelHead}>
                            <h3 className={styles.panelTitle}>Plany treningowe</h3>
                            <Link to="/trainingplan" className={styles.seeAll}>Wszystkie</Link>
                        </div>

                        {isLoading && <p className={styles.empty}>Ładowanie...</p>}

                        {!isLoading && plans.length === 0 && (
                            <div className={styles.empty}>
                                <p>Nie masz jeszcze żadnych planów.</p>
                                <Link to="/trainingplan/new" className={`btn-primary ${styles.emptyAction}`}>
                                    Utwórz pierwszy plan
                                </Link>
                            </div>
                        )}

                        {plans.slice(0, PLANS_PREVIEW).map(plan => (
                            <Link
                                key={plan.id}
                                to={`/trainingplan/${plan.id}`}
                                state={{ trainingPlan: plan, search: "" }}
                                className={styles.row}
                            >
                                <span className={styles.chip}>
                                    <ClipboardList size={18} color="var(--color-primary)" strokeWidth={1.75} />
                                </span>
                                <span className={styles.rowMain}>
                                    <p className={styles.rowTitle}>{plan.title}</p>
                                    <p className={styles.rowMeta}>{plan.description || "Brak opisu"}</p>
                                </span>
                                <ChevronRight className={styles.chevron} size={16} />
                            </Link>
                        ))}
                    </section>
                </div>
            </div>
        </PageLayout>
    );
}
