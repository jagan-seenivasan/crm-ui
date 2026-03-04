import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './account-dialog.component.html',
  styleUrls: ['./account-dialog.component.css']
})
export class AccountDialogComponent {
  form = this.fb.group({
    name: [this.data?.account?.name || '', [Validators.required]],
    email: [this.data?.account?.email || '', [Validators.email]],
    phone: [this.data?.account?.phone || ''],
    website: [this.data?.account?.website || ''],
    industry: [this.data?.account?.industry || ''],
    billingAddress: [this.data?.account?.billingAddress || ''],
    notes: [this.data?.account?.notes || '']
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; account?: any }
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
