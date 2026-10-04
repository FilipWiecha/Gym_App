import { Link } from "react-router-dom";
import { ArrowLeft, Save, Trash2, Edit2, Plus } from "lucide-react";

export const BackButton = ({ to }: { to: string }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <button type="button" className="btn-secondary">
            <ArrowLeft size={16} /> Wróć
        </button>
    </Link>
);

export const SaveButton = ({ isLoading, text = "Zapisz" }: { isLoading?: boolean, text?: string }) => (
    <button type="submit" className="btn-primary" disabled={isLoading}>
        <Save size={18} /> {isLoading ? "Przetwarzanie..." : text}
    </button>
);

export const DeleteButton = ({ onClick, isLoading }: { onClick: () => void, isLoading?: boolean }) => (
    <button type="button" onClick={onClick} className="btn-danger" disabled={isLoading}>
        <Trash2 size={16} /> Usuń
    </button>
);

export const EditButton = ({ onClick }: { onClick: () => void }) => (
    <button type="button" onClick={onClick} className="btn-secondary">
        <Edit2 size={16} /> Edytuj
    </button>
);

export const AddButton = ({ to, text }: { to: string, text?: string }) => (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <button
            type="button"
            className={text ? "btn-primary" : "btn-primary btn-icon"}
            aria-label={text || "Dodaj"}
        >
            <Plus size={18} />{text ? ` ${text}` : null}
        </button>
    </Link>
);
