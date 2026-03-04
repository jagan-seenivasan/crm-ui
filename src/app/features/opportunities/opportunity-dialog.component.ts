import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './opportunity-dialog.component.html',
  styleUrls: ['./opportunity-dialog.component.css']
})
export class OpportunityDialogComponent {
  form = this.fb.group({
    name: [this.data?.opportunity?.name || '', [Validators.required]],
    amount: [this.data?.opportunity?.amount || 0, [Validators.min(0)]],
    stageId: [this.data?.opportunity?.stageId?._id || this.data?.opportunity?.stageId || '', [Validators.required]],
    accountId: [this.data?.opportunity?.accountId?._id || this.data?.opportunity?.accountId || '', [Validators.required]],
    contactId: [this.data?.opportunity?.contactId?._id || this.data?.opportunity?.contactId || ''],
    status: [this.data?.opportunity?.status || 'OPEN', [Validators.required]],
    expectedCloseDate: [this.data?.opportunity?.expectedCloseDate || '']
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OpportunityDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { mode: 'create' | 'edit'; opportunity?: any; stages: any[]; accounts: any[]; contacts: any[] }
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
