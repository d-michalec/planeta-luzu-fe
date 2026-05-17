import { Component, inject, signal, computed } from '@angular/core';
import { map } from 'rxjs/operators';

import { RegisteredUsersApiService } from '../service/registered-users.api.service';
import { RegisteredUsersDto, Filters, RegisteredUsersViewModel } from '../shared/model/registered-users.model';

import { MenuItem } from 'primeng/api';
import { DatePipe, NgClass } from '@angular/common';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { InputText } from 'primeng/inputtext';
import { ButtonDirective } from 'primeng/button';

@Component({
  selector: 'app-registered-users',
  templateUrl: './registered-users.html',
  styleUrl: './registered-users.css',
  imports: [
    NgClass,
    DatePipe,
    Menu,
    TableModule,
    InputText,
    ButtonDirective
  ]
})
export class RegisteredUsers {

  private api = inject(RegisteredUsersApiService);

  menuItems: MenuItem[] = [];

  users = signal<RegisteredUsersViewModel[]>([]);

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
    ).subscribe(users => {
      this.users.set(users);
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
    this.api.confirmPayment(user.reservationId).subscribe(() => {
      this.loadUsers();
    });
  }

  private toViewModel(u: RegisteredUsersDto): RegisteredUsersViewModel {
    return {
      ...u,
      expiresAt: new Date(u.expiresAt.slice(0, 23)),
    };
  }
}
