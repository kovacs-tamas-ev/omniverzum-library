import { ValidationPipe } from "@nestjs/common";
import { ServerException } from "../models/general/server-exception";
import { ServerErrorDto } from "../models/general/server-response.dto";


export const customExceptionFactory = (errors) => {
    const errorMessages = errors.map(error => Object.values(error.constraints));
    const errorMessage = errorMessages.join('\n');
    const errorDto = new ServerErrorDto();
    errorDto.message = errorMessage;
    throw new ServerException(errorDto)
}

export const customValidationPipe = new ValidationPipe({ exceptionFactory: customExceptionFactory });