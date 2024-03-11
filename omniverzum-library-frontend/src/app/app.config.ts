import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';
import { serverResponseInterceptor } from './interceptors/server-response.interceptor';
import { tokenInterceptor } from './interceptors/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthService } from './auth/services/auth.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([BrowserAnimationsModule]),
    provideHttpClient(
      withInterceptors([tokenInterceptor, serverResponseInterceptor, errorInterceptor])
    ),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: (authService: AuthService) => () => authService.loadUserFromStoredTokenIfPresent(),
      deps: [AuthService],
      multi: true
    },

    MessageService,
    ConfirmationService
  ]
};
