import { Component, signal, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  mobileMenuOpen = signal(false);

  navLinks = [
    { path: '/admin/headphones', label: 'Headphones', icon: 'pi pi-headphones' },
    { path: '/admin/attendees', label: 'Zwrot słuchawek', icon: 'pi pi-users' },
    { path: '/admin/registration', label: 'Rejestracje', icon: 'pi pi-users' },
    { path: '/admin/assign-headphones', label: 'Przypisanie słuchawek', icon: 'pi pi-headphones' }
  ];


  @HostListener('document:keydown.escape')
  onEscape() {
    this.mobileMenuOpen.set(false);
  }
}
