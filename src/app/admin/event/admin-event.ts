import { AsyncPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, map, of, shareReplay, startWith, switchMap, tap, timeout, finalize } from 'rxjs';
import { AdminEventApiService } from '../service/admin-event.api.service';
import { EventDto } from '../../shared/services/event/event.model';
import { resolveApiErrorMessage } from '../../shared/services/api/api-error.util';

type EventState = {
  status: 'loading' | 'ready' | 'error';
  event: EventDto | null;
  message?: string;
};

@Component({
  selector: 'app-admin-event',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, AsyncPipe, DatePipe, DecimalPipe, ButtonModule, InputTextModule],
  templateUrl: './admin-event.html',
  styleUrl: './admin-event.css',
})
export class AdminEvent {
  private formBuilder = inject(FormBuilder);
  private api = inject(AdminEventApiService);
  private messages = inject(MessageService);
  private reloadEvent$ = new BehaviorSubject<void>(undefined);

  private currentEvent: EventDto | null = null;

  readonly eventState$ = this.reloadEvent$.pipe(
    switchMap(() =>
      this.api.getCurrentEvent().pipe(
        timeout(8000),
        map(response => this.normalizeEvent(response)),
        map(event => ({ status: 'ready', event }) satisfies EventState),
        catchError(error => {
          const message = this.resolveLoadErrorMessage(error);
          return of({ status: 'error', event: null, message } satisfies EventState);
        }),
        startWith({ status: 'loading', event: null } satisfies EventState)
      )
    ),
    tap(state => {
      this.currentEvent = state.event;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    date: ['', [Validators.required]],
    price: [150, [Validators.required, Validators.min(0.01)]],
  });

  isSaving = false;
  isDeleting = false;
  isDeletingAllData = false;

  reloadEvent() {
    this.reloadEvent$.next();
  }

  createEvent() {
    this.form.markAllAsTouched();
    if (this.form.invalid || this.isSaving || this.currentEvent) return;

    this.isSaving = true;
    this.api.createEvent(this.form.getRawValue())
      .pipe(finalize(() => this.isSaving = false))
      .subscribe({
        next: () => {
          this.form.reset();
          this.messages.add({ severity: 'success', summary: 'Event utworzony', detail: 'Countdown na stronie głównej został zaktualizowany.' });
          this.reloadEvent();
        },
        error: err => this.showError(err, 'Nie udało się utworzyć eventu.'),
      });
  }

  deleteEvent(event: EventDto) {
    if (this.isDeleting) return;

    this.isDeleting = true;
    this.api.deleteEvent(event.id)
      .pipe(finalize(() => this.isDeleting = false))
      .subscribe({
        next: () => {
          this.messages.add({ severity: 'success', summary: 'Event usunięty', detail: 'Countdown zniknie ze strony głównej.' });
          this.reloadEvent();
        },
        error: err => this.showError(err, 'Nie udało się usunąć eventu.'),
      });
  }

  deleteAllData() {
    if (this.isDeletingAllData) return;

    const confirmed = window.confirm('Usunąć wszystkie dane? Ta akcja usunie event, rejestracje, bilety, przypisania i słuchawki.');
    if (!confirmed) return;

    this.isDeletingAllData = true;
    this.api.deleteAllData()
      .pipe(finalize(() => this.isDeletingAllData = false))
      .subscribe({
        next: () => {
          this.form.reset({ name: '', date: '', price: 150 });
          this.messages.add({ severity: 'success', summary: 'Dane usunięte', detail: 'Wszystkie dane systemu zostały wyczyszczone.' });
          this.reloadEvent();
        },
        error: err => this.showError(err, 'Nie udało się usunąć wszystkich danych.'),
      });
  }

  hasError(controlName: 'name' | 'date' | 'price'): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.touched || control.dirty);
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

  private resolveLoadErrorMessage(error: unknown): string | undefined {
    if (error instanceof HttpErrorResponse && (error.status === 404 || error.status === 204)) {
      return undefined;
    }

    const message = resolveApiErrorMessage(error, 'Nie udało się pobrać eventu.');
    this.messages.add({ severity: 'error', summary: 'Błąd', detail: message });
    return message;
  }

  private showError(error: unknown, fallback: string) {
    this.messages.add({
      severity: 'error',
      summary: 'Błąd',
      detail: resolveApiErrorMessage(error, fallback),
    });
  }
}
