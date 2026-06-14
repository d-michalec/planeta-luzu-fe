import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { catchError, combineLatest, interval, map, of, shareReplay, startWith, timeout } from 'rxjs';
import { MainNavbar } from '../main-navbar/main-navbar';
import { resolveApiErrorMessage } from '../../shared/services/api/api-error.util';
import { EventApiService } from '../../shared/services/event/event.api.service';
import { EventDto } from '../../shared/services/event/event.model';
import { RegistrationApiService } from './registration.api.service';
import { RegisterResponse } from './registration.model';

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

type RegistrationWindowState = {
  status: 'loading' | 'ready';
  event: EventDto | null;
  closed: boolean;
  countdown: Countdown;
};

@Component({
  selector: 'app-registration',
  imports: [ReactiveFormsModule, MainNavbar, AsyncPipe],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration {
  private readonly formBuilder = inject(FormBuilder);
  private readonly registrationApi = inject(RegistrationApiService);
  private readonly eventApi = inject(EventApiService);
  private readonly messages = inject(MessageService);

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  readonly event$ = this.eventApi.getCurrentEvent().pipe(
    timeout(8000),
    map(response => this.normalizeEvent(response)),
    catchError(() => of(null)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly registrationWindow$ = combineLatest([
    this.event$,
    interval(1000).pipe(startWith(0)),
  ]).pipe(
    map(([event]) => this.createRegistrationWindowState(event)),
    startWith({
      status: 'loading',
      event: null,
      closed: true,
      countdown: this.emptyCountdown(),
    } satisfies RegistrationWindowState),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  isSubmitting = false;
  registration: RegisterResponse | null = null;
  errorMessage = '';

  submit(windowState: RegistrationWindowState | null): void {
    this.form.markAllAsTouched();
    this.registration = null;
    this.errorMessage = '';

    if (!windowState || windowState.status === 'loading' || windowState.closed) {
      this.errorMessage = 'Rejestracja na to wydarzenie jest już zamknięta.';
      return;
    }

    if (this.form.invalid || this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    this.registrationApi
      .register(this.form.getRawValue())
      .subscribe({
        next: (registration) => {
          this.isSubmitting = false;
          this.registration = registration;
          this.form.reset();
          this.messages.add({
            severity: 'success',
            summary: 'Rejestracja powiodła się',
            detail: `Potwierdzenie wysłaliśmy na adres ${registration.email}.`,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = this.resolveErrorMessage(error);
          this.messages.add({
            severity: 'error',
            summary: 'Rejestracja nie powiodła się',
            detail: this.errorMessage,
          });
        },
      });
  }

  hasError(controlName: 'firstName' | 'lastName' | 'email'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
  }

  private createRegistrationWindowState(event: EventDto | null): RegistrationWindowState {
    if (!event) {
      return {
        status: 'ready',
        event: null,
        closed: true,
        countdown: this.emptyCountdown(),
      };
    }

    const closeAt = new Date(event.date).getTime() - 7 * 24 * 60 * 60 * 1000;
    const distance = closeAt - Date.now();

    return {
      status: 'ready',
      event,
      closed: distance <= 0 || Number.isNaN(closeAt),
      countdown: this.createCountdown(Math.max(0, distance)),
    };
  }

  private normalizeEvent(response: unknown): EventDto | null {
    if (!response) {
      return null;
    }

    if (Array.isArray(response)) {
      return response.length > 0 ? this.normalizeEvent(response[0]) : null;
    }

    if (typeof response === 'object') {
      const event = response as Partial<EventDto>;

      if (event.id != null && event.name && event.date) {
        return {
          id: Number(event.id),
          name: String(event.name),
          date: String(event.date),
          price: Number(event.price ?? 0),
          createdAt: event.createdAt ? String(event.createdAt) : '',
        };
      }
    }

    return null;
  }

  private createCountdown(distance: number): Countdown {
    const totalSeconds = Math.floor(distance / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days: this.pad(days),
      hours: this.pad(hours),
      minutes: this.pad(minutes),
      seconds: this.pad(seconds),
    };
  }

  private emptyCountdown(): Countdown {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
    };
  }

  private pad(value: number): string {
    return String(value).padStart(2, '0');
  }

  private resolveErrorMessage(error: HttpErrorResponse): string {
    const backendMessage =
      typeof error.error?.message === 'string' ? error.error.message : '';

    if (error.status === 409 || backendMessage.toLowerCase().includes('email')) {
      return 'Ten adres e-mail jest już zarejestrowany.';
    }

    if (error.status === 400 && error.error?.code === 'REGISTRATION_CLOSED') {
      return 'Rejestracja na to wydarzenie jest już zamknięta.';
    }

    return resolveApiErrorMessage(error, 'Nie udało się wysłać rejestracji. Spróbuj ponownie za chwilę.');
  }
}
