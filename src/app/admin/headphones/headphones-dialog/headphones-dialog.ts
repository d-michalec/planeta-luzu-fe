import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgClass, NgIf } from '@angular/common';
import { HeadphonesStatus } from '../../shared/model/headphones.model';

@Component({
  selector: 'app-headphones-dialog',
  imports: [
    DialogModule,
    ButtonModule,
    InputText,
    ReactiveFormsModule,
    NgClass,
    NgIf
  ],
  templateUrl: './headphones-dialog.html',
  styleUrl: './headphones-dialog.css',
})
export class HeadphonesDialog {
  private fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  statuses = Object.values(HeadphonesStatus);

  mode: 'create' | 'edit' = this.config.data.mode;

  form = this.fb.nonNullable.group({
    headphonesId: this.fb.control(
      {
        value: this.config.data.form.headphonesId,
        disabled: this.mode === 'edit'
      },
      Validators.required
    ),
    status: this.fb.control(
      this.config.data.form.status || HeadphonesStatus.DOSTĘPNE,
      Validators.required
    )
  });

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.ref.close({
      mode: this.mode,
      form: this.form.getRawValue()
    });
  }

  cancel() {
    this.ref.close(null);
  }

  setStatus(status: HeadphonesStatus) {
    this.form.controls.status.setValue(status);
  }
}
