import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NgClass } from '@angular/common';
import { ReturnCondition } from '../../shared/model/attendees.model';


@Component({
  selector: 'app-return-headphones-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    InputText,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './return-headphones-dialog.html',
})
export class ReturnHeadphonesDialog {

  private fb = inject(FormBuilder);
  ref = inject(DynamicDialogRef);
  config = inject(DynamicDialogConfig);

  statuses = Object.values(ReturnCondition);

  form = this.fb.nonNullable.group({
    headphonesId: this.fb.control({
      value: this.config.data.headphonesId,
      disabled: true
    }),
    status: this.fb.control<ReturnCondition | null>(null, Validators.required)
  });

  save() {
    if (this.form.invalid) return;

    this.ref.close(this.form.getRawValue());
  }

  cancel() {
    this.ref.close(null);
  }

  setStatus(status: ReturnCondition) {
    this.form.controls.status.setValue(status);
  }
}
