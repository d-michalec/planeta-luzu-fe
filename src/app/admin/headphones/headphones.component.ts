import { Component, effect, inject, signal } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

import { HeadphonesApiService } from '../service/headphones.api.service';
import { HeadphonesDto } from '../shared/model/headphones.model';
import { HeadphonesDialog } from './headphones-dialog/headphones-dialog';

@Component({
  selector: 'app-headphones',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    NgIf,
    TableModule,
    ButtonModule,
    Menu,
  ],
  providers: [DialogService],
  templateUrl: './headphones.component.html',
  styleUrl: './headphones.component.css',
})
export class Headphones {

  private api = inject(HeadphonesApiService);
  private dialog = inject(DialogService);

  headphones = signal<HeadphonesDto[]>([]);
  refresh = signal(0);

  selectedItem: HeadphonesDto | null = null;
  ref: DynamicDialogRef | null = null;
  error: string | null = null;

  constructor() {
    effect(() => {
      this.refresh();

      this.api.getHeadphones().subscribe({
        next: data => {
          this.error = null;
          this.headphones.set(data);
        },
        error: err => {
          console.error('GET HEADPHONES ERROR:', err);
          this.error = 'Nie udało się pobrać słuchawek.';
        }
      });
    });
  }

  menuItems: MenuItem[] = [
    {
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => this.openEdit()
    },
    {
      label: 'Delete',
      icon: 'pi pi-trash',
      command: () => this.delete()
    }
  ];

  openCreate() {
    this.openDialog('create', { headphonesId: null, status: '' });
  }

  openEdit() {
    if (!this.selectedItem) return;
    this.openDialog('edit', { ...this.selectedItem });
  }

  private openDialog(mode: 'create' | 'edit', form: any) {
    this.ref = this.dialog.open(HeadphonesDialog, {
      header: mode === 'create' ? 'Add Headphones' : 'Edit Headphones',
      width: '420px',
      styleClass: 'headphones-dialog',
      data: { mode, form }
    });

    if (this.ref == null) {
      return;
    }

    this.ref.onClose.subscribe((result) => {
      if (!result) return;

      if (result.mode === 'edit') {
        this.api.updateHeadphones(result.form).subscribe({
          next: () => this.refresh.update(v => v + 1),
          error: err => {
            console.error('UPDATE HEADPHONES ERROR:', err);
            this.error = 'Nie udało się zaktualizować słuchawek.';
          }
        });
      } else {
        this.api.createHeadphones(result.form.headphonesId).subscribe({
          next: () => this.refresh.update(v => v + 1),
          error: err => {
            console.error('CREATE HEADPHONES ERROR:', err);
            this.error = 'Nie udało się dodać słuchawek.';
          }
        });
      }
    });
  }

  delete() {
    if (!this.selectedItem) return;

    this.api.deleteHeadphones(this.selectedItem.headphonesId).subscribe({
      next: () => this.refresh.update(v => v + 1),
      error: err => {
        console.error('DELETE HEADPHONES ERROR:', err);
        this.error = 'Nie udało się usunąć słuchawek.';
      }
    });
  }

  onMenuClick(item: HeadphonesDto, menu: any, event: Event) {
    this.selectedItem = item;
    menu.toggle(event);
  }

  getStatusClass(status: string | null | undefined): string {
    return (status || 'unknown').toLowerCase();
  }
}
