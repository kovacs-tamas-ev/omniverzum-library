import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, tap } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('interceptor called');
  return next(req).pipe(
    tap(response => {
      console.log('-- resp in interceptor --\n', response);
      
    }),
    catchError(error => {
      // Általános hibaüzenet kiírása
      console.log('error ég az interceptorban');
      
      throw error;
    })
  );
};
