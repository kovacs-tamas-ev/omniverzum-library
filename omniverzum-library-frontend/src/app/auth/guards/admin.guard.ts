import { inject } from '@angular/core';
import { CanActivateChildFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const userData = authService.getUserData();
  
  return (userData && userData?.admin) ?? false;
};
