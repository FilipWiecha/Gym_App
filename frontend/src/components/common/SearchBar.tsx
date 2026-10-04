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
        <form onSubmit={handleSubmit} className="search-form">
            <div className="input-with-icon">
                <Search className="icon-left" size={18} />
                <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder={placeholder}
                />
                {searchInput && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="icon-btn search-clear"
                        aria-label="Wyczyść wyszukiwanie"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
            <button type="submit" className="btn-secondary">
                Szukaj
            </button>
        </form>
    );
}
