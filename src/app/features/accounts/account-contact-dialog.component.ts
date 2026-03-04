import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './account-contact-dialog.component.html',
  styleUrls: ['./account-contact-dialog.component.css']
})
export class AccountContactDialogComponent {
  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    title: ['']
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accountId: string }
  ) {}

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.dialogRef.close({ ...this.form.getRawValue(), accountId: this.data.accountId });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
