import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export function useSlicePagination() {
    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "0", 10);
    const searchQuery = searchParams.get("query") || "";
    const [hasNext, setHasNext] = useState(false);

    const nextPage = () => {
        if (hasNext) {
            searchParams.set("page", (currentPage + 1).toString());
            setSearchParams(searchParams);
        }
    };

    const prevPage = () => {
        if (currentPage > 0) {
            searchParams.set("page", (currentPage - 1).toString());
            setSearchParams(searchParams);
        }
    };

    const updateSearch = (query: string) => {
        if (query.trim()) {
            searchParams.set("query", query.trim());
        } else {
            searchParams.delete("query");
        }
        searchParams.set("page", "0");
        setSearchParams(searchParams);
    };

    return {
        currentPage,
        searchQuery,
        hasNext,
        setHasNext,
        nextPage,
        prevPage,
        updateSearch,
        hasPrev: currentPage > 0,
        backUrlSearch: `?${searchParams.toString()}`
    };
}