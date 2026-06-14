import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { baseUrlInterceptor } from './shared/services/api/baseUrlInterceptor';
import { adminUnauthorizedInterceptor } from './admin/auth/admin-unauthorized.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import Nora from '@primeuix/themes/nora';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([baseUrlInterceptor, adminUnauthorizedInterceptor])),
    providePrimeNG({
      theme: {
        preset: Nora,
      },
    }),
    MessageService,
  ],
};
