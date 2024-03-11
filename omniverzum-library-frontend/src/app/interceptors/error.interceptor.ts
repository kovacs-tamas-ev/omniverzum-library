import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { ErrorNature, ServerResponseDto } from '../models/server-response.dto';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError(error => {
      messageService.add({ severity: 'error', summary: 'Hiba', detail: 'Váratlan hiba történt', sticky: true });
      throw error;
    }),
    tap(response => {
      if (response?.type === 0) {
        return;
      }

      const body = (response as HttpResponse<ServerResponseDto<any>>).body;
      if (!body?.success) {
        if (body?.error?.message) {
          messageService.add({ severity: 'error', summary: 'Hiba', detail: body?.error?.message, sticky: true });
        }

        if (body?.error?.nature === ErrorNature.LOGIN) {
          authService.logout();
          router.navigate(['/login']);
          return;
        }

        throw new Error(body?.error?.message);
      }
    }),
  );
};
