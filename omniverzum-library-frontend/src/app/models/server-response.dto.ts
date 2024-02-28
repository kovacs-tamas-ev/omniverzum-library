export interface ServerResponseDto<T> {
    success: boolean;
    data?: T;
    error?: ServerErrorDto;
}

export interface ServerErrorDto {
    nature?: string;
    message: string;
}