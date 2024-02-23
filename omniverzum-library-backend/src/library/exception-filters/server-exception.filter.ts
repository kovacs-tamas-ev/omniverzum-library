import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ServerException } from '../models/general/server-exception';
import { ServerResponseDto } from '../models/general/server-response.dto';

@Catch(ServerException)
export class ServerExceptionFilter<T> implements ExceptionFilter {
  catch(exception: ServerException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const serverResponse = ServerResponseDto.withError(exception.error);
    response.status(200).json(serverResponse);
  }
}
