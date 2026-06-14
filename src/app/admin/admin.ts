import { Component, signal, HostListener, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AdminAuthService } from './auth/admin-auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private auth = inject(AdminAuthService);
  private router = inject(Router);
  private messages = inject(MessageService);

  mobileMenuOpen = signal(false);

  navLinks = [
    { path: '/admin/event', label: 'Event', icon: 'pi pi-calendar' },
    { path: '/admin/headphones', label: 'Słuchawki', icon: 'pi pi-headphones' },
    { path: '/admin/attendees', label: 'Zwrot słuchawek', icon: 'pi pi-users' },
    { path: '/admin/registration', label: 'Rejestracje', icon: 'pi pi-users' },
    { path: '/admin/assign-headphones', label: 'Przypisanie słuchawek', icon: 'pi pi-headphones' }
  ];


  @HostListener('document:keydown.escape')
  onEscape() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.messages.add({ severity: 'success', summary: 'Wylogowano', detail: 'Sesja admina została zakończona.' });
        this.router.navigate(['/admin/login']);
      },
      error: () => {
        this.auth.clearSession();
        this.router.navigate(['/admin/login']);
      }
    });
  }
}
