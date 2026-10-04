import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

interface PageHeaderProps {
    title: string;
    description?: string;
    actionLink?: string;
    actionText?: string;
}

export function PageHeader({ title, description, actionLink, actionText }: PageHeaderProps) {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div className="form-header" style={{ margin: 0 }}>
                <h2 style={{ margin: 0 }}>{title}</h2>
                {description && <p style={{ margin: 0 }}>{description}</p>}
            </div>
            {actionLink && actionText && (
                <Link to={actionLink}>
                    <button className="submit-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px' }}>
                        <Plus size={18} /> {actionText}
                    </button>
                </Link>
            )}
        </div>
    );
}