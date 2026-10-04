import { Trash2 } from "lucide-react";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
    confirmText?: string;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, isLoading, confirmText = "Usuń" }: ConfirmModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>{title}</h3>
                <p>{message}</p>
                
                <div className="modal-actions">
                    <button type="button" onClick={onCancel} className="btn-secondary" disabled={isLoading}>
                        Anuluj
                    </button>
                    <button type="button" onClick={onConfirm} className="btn-danger" disabled={isLoading}>
                        <Trash2 size={16} /> {isLoading ? "Przetwarzanie..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}