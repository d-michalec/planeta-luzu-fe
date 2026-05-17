import { Component, inject, OnInit, signal } from '@angular/core';
import { AttendeesDto, AttendeesFilter } from '../shared/model/attendees.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { AttendeesApiService } from '../service/attendees.api.service';

import { DialogService } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';
import { ReturnHeadphonesDialog } from './return-headphones-dialog/return-headphones-dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-attendees',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    MenuModule,
    NgClass,
    NgForOf,
    NgIf,
    InputTextModule
  ],
  templateUrl: './attendees.html',
  styleUrl: './attendees.css',
  providers: [DialogService],
})
export class Attendees implements OnInit {
  private api = inject(AttendeesApiService);
  private dialog = inject(DialogService);

  attendees = signal<AttendeesDto[]>([]);
  filtered = signal<AttendeesDto[]>([]);
  selectedItem?: AttendeesDto;
  error: string | null = null;

  filters = signal<AttendeesFilter>({
    firstName: '',
    lastName: '',
    headphonesId: ''
  });

  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.loadAttendees();
    this.initMenu();
  }

  loadAttendees() {
    this.api.getAttendees().subscribe({
      next: data => {
        this.error = null;
        this.attendees.set(data);
        this.applyFilter();
      },
      error: err => {
        console.error('GET ATTENDEES ERROR:', err);
        this.error = 'Nie udało się pobrać uczestników.';
      }
    });
  }

  initMenu() {
    this.menuItems = [
      {
        label: 'Return headphones',
        icon: 'pi pi-undo',
        command: () => this.openReturnDialog(),
      },
    ];
  }

  applyFilter() {
    const f = this.filters();
    const data = this.attendees();

    const firstName = (f.firstName || '').trim().toLowerCase();
    const lastName = (f.lastName || '').trim().toLowerCase();
    const headphonesId = (f.headphonesId || '').trim();

    const filtered = data.filter(a => {
      const attendeeFirstName = (a.firstName || '').toLowerCase();
      const attendeeLastName = (a.lastName || '').toLowerCase();
      const attendeeHeadphonesId = a.headphonesId == null ? '' : String(a.headphonesId);

      const first = !firstName || attendeeFirstName.includes(firstName);
      const last = !lastName || attendeeLastName.includes(lastName);
      const id = !headphonesId || attendeeHeadphonesId.includes(headphonesId);

      return first && last && id;
    });

    this.filtered.set(filtered);
  }

  resetFilters() {
    this.filters.set({
      firstName: '',
      lastName: '',
      headphonesId: ''
    });

    this.applyFilter();
  }

  openReturnDialog() {
    if (!this.selectedItem) return;

    if (this.selectedItem.headphonesId == null) {
      this.error = 'Ten uczestnik nie ma przypisanych słuchawek.';
      return;
    }

    const ref = this.dialog.open(ReturnHeadphonesDialog, {
      header: 'Return headphones',
      width: '400px',
      data: {
        headphonesId: this.selectedItem.headphonesId,
      },
    });

    if (ref == null) {
      return;
    }

    ref.onClose.subscribe(result => {
      if (!result) return;

      this.api.returnHeadphones(result).subscribe({
        next: () => {
          this.error = null;
          this.loadAttendees();
        },
        error: err => {
          console.error('RETURN HEADPHONES ERROR:', err);
          this.error = 'Nie udało się zwrócić słuchawek.';
        }
      });
    });
  }

  getStatusLabel(attendee: AttendeesDto): string {
    return attendee.assignmentStatus || 'UNKNOWN';
  }

  getStatusClass(attendee: AttendeesDto): string {
    return this.getStatusLabel(attendee).toLowerCase();
  }

  onMenuClick(item: AttendeesDto, menu: any, event: Event) {
    this.selectedItem = item;
    menu.toggle(event);
  }

  onFilterChange(field: keyof AttendeesFilter, value: string) {
    this.filters.update(f => ({
      ...f,
      [field]: value
    }));

    this.applyFilter();
  }
}
