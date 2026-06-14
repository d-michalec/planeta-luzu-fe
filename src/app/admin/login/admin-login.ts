import { Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs';
import { AdminAuthService } from '../auth/admin-auth.service';
import { resolveApiErrorMessage } from '../../shared/services/api/api-error.util';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterLink, ButtonModule, InputTextModule, PasswordModule],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private auth = inject(AdminAuthService);
  private router = inject(Router);
  private messages = inject(MessageService);

  email = '';
  password = '';
  isSubmitting = false;
  error: string | null = null;

  submit() {
    const email = this.email.trim();
    if (!email || !this.password || this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = null;

    this.auth.login({ email, password: this.password })
      .pipe(finalize(() => this.isSubmitting = false))
      .subscribe({
        next: () => {
          this.messages.add({ severity: 'success', summary: 'Zalogowano', detail: 'Witaj w panelu admina.' });
          this.router.navigate(['/admin/headphones']);
        },
        error: err => {
          this.error = resolveApiErrorMessage(err, 'Nie udało się zalogować.');
          this.messages.add({ severity: 'error', summary: 'Błąd logowania', detail: this.error });
        }
      });
  }
}
