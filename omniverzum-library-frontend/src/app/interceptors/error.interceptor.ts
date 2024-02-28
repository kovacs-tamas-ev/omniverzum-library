import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { ServerResponseDto } from '../models/server-response.dto';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError(error => {
      console.log('catch for error interceptor');
      
      // Általános hibaüzenet kiírása
      console.error('Váratlan hiba történt');
      
      throw error;
    }),
    tap(response => {
      if (response?.type === 0) {
        return;
      }

      console.log('tap for error interceptor');
      const body = (response as HttpResponse<ServerResponseDto<any>>).body;
      if (!body?.success) {
        // Konkrét hibaüzenet kiírása
        console.error('-- server response error --\n', body?.error?.message);
        throw new Error(body?.error?.message);
      }
    }),
  );
};
