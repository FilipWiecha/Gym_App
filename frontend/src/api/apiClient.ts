const BASE_URL = import.meta.env.VITE_URL_BASE_BACKEND;

export async function apiClient<T>(
    endpoint:String,
    options: RequestInit = {}
): Promise<T> {
    
    const config: RequestInit = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if(!response.ok){
        const errorData = await response.json().catch(()=> null);
        throw new Error(errorData?.error || `Http error: ${response.status}`);
    }

    if(response.status === 204){
        return {} as T;
    }

    return response.json();
}