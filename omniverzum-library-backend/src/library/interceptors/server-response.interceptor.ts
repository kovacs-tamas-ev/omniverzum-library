import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ServerResponseDto } from '../models/general/server-response.dto';

@Injectable()
export class ServerResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (!(data instanceof ServerResponseDto)) {
          return ServerResponseDto.withData(data);
        }
        return data;
      }),
    );
  }
}
