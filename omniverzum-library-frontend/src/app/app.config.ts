import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { routes } from './app.routes';
import { AuthService } from './auth/services/auth.service';
import { errorInterceptor } from './interceptors/error.interceptor';
import { serverResponseInterceptor } from './interceptors/server-response.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withHashLocation()),
    provideAnimations(),
    provideHttpClient(
      withInterceptors([tokenInterceptor, serverResponseInterceptor, errorInterceptor])
    ),
    MessageService,
    ConfirmationService,
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.loadUserFromStoredTokenIfPresent(),
      deps: [AuthService],
      multi: true
    }
  ]
};
