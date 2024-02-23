export class ServerResponseDto<T> {
    success: boolean;
    data?: T;
    error?: ServerErrorDto;

    public static withError(error: ServerErrorDto): ServerResponseDto<void> {
        const serverResponse = new ServerResponseDto<void>();
        serverResponse.success = false;
        serverResponse.error = error;
        return serverResponse;
    }

    public static withData<T>(data: T): ServerResponseDto<T> {
        const serverResponse = new ServerResponseDto<T>();
        serverResponse.success = true;
        serverResponse.data = data;
        return serverResponse;
    }
}

export class ServerErrorDto {
    nature?: string;
    message: string;
}