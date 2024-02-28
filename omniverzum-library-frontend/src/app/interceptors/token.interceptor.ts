import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../auth/services/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  let reqToSend = req;
  if (authService.hasLoggedInUser()) {
    const token = authService.getToken()!;
    const headers = req.headers.set('Authorization', `Bearer ${token}`);
    reqToSend = req.clone({ headers });
  }

  return next(req);
};
