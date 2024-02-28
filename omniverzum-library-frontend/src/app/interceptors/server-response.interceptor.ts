import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs';
import { ServerResponseDto } from '../models/server-response.dto';

export const serverResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    map(response => {
      if (response?.type === 0) {
        return response;
      }

      if (response instanceof HttpResponse ) {
        const responseAsHttpResponse = response as HttpResponse<ServerResponseDto<any>>;
        return responseAsHttpResponse.clone({ body: responseAsHttpResponse.body?.data });
      }

      return response;
    })
  );
};
