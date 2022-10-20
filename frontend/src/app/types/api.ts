export interface ApiResponse<T> {
    errorCode: number;
    errorMessage: string;
    response: T
}

export interface optionsMap{
    index: string;
    value: string
}