import { Component, inject, signal, computed } from '@angular/core';
import { map } from 'rxjs/operators';

import { RegisteredUsersApiService } from '../service/registered-users.api.service';
import { AdminRegisterRequest, RegisteredUsersDto, Filters, RegisteredUsersViewModel } from '../shared/model/registered-users.model';

import { MenuItem, MessageService } from 'primeng/api';
import { DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';
import { resolveApiErrorMessage } from '../../shared/services/api/api-error.util';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.html',
  styleUrl: './registered-users.css',
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    DatePipe,
    Menu,
    TableModule,
    InputText,
    ButtonDirective
  ]
})
export class RegisteredUsers {

  private api = inject(RegisteredUsersApiService);
  private messages = inject(MessageService);

  menuItems: MenuItem[] = [];

  users = signal<RegisteredUsersViewModel[]>([]);
  isRegistering = signal(false);
  isDeletingAll = signal(false);

  newRegistration = signal<AdminRegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
  });

  filters = signal<Filters>({
    firstName: '',
    lastName: '',
    email: '',
  });

  constructor() {
    this.loadUsers();
  }

  private loadUsers() {
    this.api.getRegisteredUsers().pipe(
      map(users => users.map(u => this.toViewModel(u)))
    ).subscribe({
      next: users => {
        this.users.set(users);
      },
      error: err => {
        this.isDeletingAll.set(false);
        this.messages.add({
          severity: 'error',
          summary: 'Błąd',
          detail: resolveApiErrorMessage(err, 'Nie udało się pobrać rezerwacji.'),
        });
      }
    });
  }

  filteredUsers = computed(() => {
    const f = this.filters();
    const users = this.users();

    return users.filter(u =>
      (!f.firstName || u.firstName.toLowerCase().includes(f.firstName.toLowerCase())) &&
      (!f.lastName || u.lastName.toLowerCase().includes(f.lastName.toLowerCase())) &&
      (!f.email || u.email.toLowerCase().includes(f.email.toLowerCase()))
    );
  });

  onFilterChange(field: keyof Filters, value: string) {
    this.filters.update(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  resetFilters() {
    this.filters.set({
      firstName: '',
      lastName: '',
      email: '',
    });
  }

  onNewRegistrationChange(field: keyof AdminRegisterRequest, value: string) {
    this.newRegistration.update(prev => ({
      ...prev,
      [field]: value,
    }));
  }

  registerUser() {
    const request = {
      firstName: this.newRegistration().firstName.trim(),
      lastName: this.newRegistration().lastName.trim(),
      email: this.newRegistration().email.trim(),
    };

    if (!request.firstName || !request.lastName || !request.email) {
      this.messages.add({
        severity: 'warn',
        summary: 'Brak danych',
        detail: 'Uzupełnij imię, nazwisko i email.',
      });
      return;
    }

    this.isRegistering.set(true);
    this.api.registerUser(request).subscribe({
      next: () => {
        this.messages.add({
          severity: 'success',
          summary: 'Dodano rejestrację',
          detail: 'Uczestnik został zarejestrowany przez admina.',
        });
        this.newRegistration.set({ firstName: '', lastName: '', email: '' });
        this.loadUsers();
      },
      error: err => {
        this.messages.add({
          severity: 'error',
          summary: 'Błąd',
          detail: resolveApiErrorMessage(err, 'Nie udało się dodać rejestracji.'),
        });
      },
      complete: () => this.isRegistering.set(false),
    });
  }

  getMenuItems(user: RegisteredUsersViewModel): MenuItem[] {
    return [
      {
        label: 'Actions',
        items: [
          {
            label: user.paid ? 'Zapłacone' : 'Oznacz jako zapłacony',
            icon: user.paid ? 'pi pi-check-circle' : 'pi pi-check',
            command: () => {
              if (!user.paid) {
                this.togglePaid(user);
              }
            },
            disabled: user.paid,
          },
        ],
      },
    ];
  }

  openMenu(user: RegisteredUsersViewModel, menu: any, event: Event) {
    this.menuItems = this.getMenuItems(user);
    menu.toggle(event);
  }

  togglePaid(user: RegisteredUsersViewModel) {
    this.api.confirmPayment(user.reservationId).subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'Potwierdzono', detail: 'Płatność została potwierdzona.' });
        this.loadUsers();
      },
      error: err => {
        this.messages.add({
          severity: 'error',
          summary: 'Błąd',
          detail: resolveApiErrorMessage(err, 'Nie udało się potwierdzić płatności.'),
        });
      }
    });
  }

  deleteAll() {
    if (this.isDeletingAll()) return;

    const confirmed = window.confirm('Usunąć wszystkie rejestracje? Ta akcja usunie też powiązane bilety i przypisania słuchawek.');
    if (!confirmed) return;

    this.isDeletingAll.set(true);
    this.api.deleteAll().subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'Usunięto', detail: 'Wszystkie rejestracje zostały usunięte.' });
        this.loadUsers();
      },
      error: err => {
        this.messages.add({
          severity: 'error',
          summary: 'Błąd',
          detail: resolveApiErrorMessage(err, 'Nie udało się usunąć rejestracji.'),
        });
      },
      complete: () => this.isDeletingAll.set(false),
    });
  }

  getPaymentStatusLabel(user: RegisteredUsersViewModel): string {
    return user.paid ? 'PAID' : 'NOT PAID';
  }

  getPaymentStatusClass(user: RegisteredUsersViewModel): string {
    return user.paid ? 'paid' : 'unpaid';
  }

  private toViewModel(u: RegisteredUsersDto): RegisteredUsersViewModel {
    return {
      ...u,
      expiresAt: new Date(u.expiresAt.slice(0, 23)),
    };
  }
}
