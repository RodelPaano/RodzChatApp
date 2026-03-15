export function validateSearchInput (query: string): string {
    if(!query || query.trim().length === 0) {
        throw new Error("Search query is Required");
    }

    return query.trim();
}

export function validateSearchType (query: string, min = 2,  max = 100): string {
    if(query.length < min || query.length > max) {
        throw new Error(`Search query must be between ${min} and ${max} characters`);
    }
    if(!query || query.trim().length === 0) {
        throw new Error("Search query is Required");
    }

    return query.trim();
}

const regexSafe = /[^a-zA-Z0-9]/g;
export function removeSpecialCharacters (query: string): string {
    if(!query || query.trim().length === 0) {
        throw new Error("Search query is Required");
    }
    return query;
}