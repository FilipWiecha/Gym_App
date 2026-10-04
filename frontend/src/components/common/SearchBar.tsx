import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
    initialValue: string;
    onSearch: (query: string) => void;
    placeholder?: string;
}

export function SearchBar({ initialValue, onSearch, placeholder = "Szukaj..." }: SearchBarProps) {
    const [searchInput, setSearchInput] = useState(initialValue);

    useEffect(() => {
        setSearchInput(initialValue);
    }, [initialValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchInput);
    };

    const clearSearch = () => {
        setSearchInput("");
        onSearch("");
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '32px', display: 'flex', gap: '12px' }}>
            <div className="input-with-icon" style={{ flex: 1 }}>
                <Search className="icon-left" size={18} />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '12px 40px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                />
                {searchInput && (
                    <button type="button" onClick={clearSearch} style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
                        <X size={18} />
                    </button>
                )}
            </div>
            <button type="submit" className="google-btn" style={{ width: 'auto', padding: '0 24px' }}>
                Szukaj
            </button>
        </form>
    );
}