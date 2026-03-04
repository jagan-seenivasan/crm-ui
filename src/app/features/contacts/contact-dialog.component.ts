import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './contact-dialog.component.html',
  styleUrls: ['./contact-dialog.component.css']
})
export class ContactDialogComponent {
  form = this.fb.group({
    firstName: [this.data?.contact?.firstName || '', [Validators.required]],
    lastName: [this.data?.contact?.lastName || ''],
    email: [this.data?.contact?.email || '', [Validators.required, Validators.email]],
    phone: [this.data?.contact?.phone || ''],
    title: [this.data?.contact?.title || '']
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; contact?: any }
  ) {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
