import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs';
import { ServerResponseDto } from '../models/server-response.dto';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
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
        throw new Error(body?.error?.message);
      }
    }),
  );
};
