import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';

@Component({
  templateUrl: './lead-convert-dialog.component.html',
  styleUrls: ['./lead-convert-dialog.component.css']
})
export class LeadConvertDialogComponent implements OnInit {
  accounts: any[] = [];

  accountForm = this.fb.group({
    accountMode: ['existing', [Validators.required]],
    existingAccountId: [''],
    name: [''],
    email: ['', [Validators.email]],
    phone: [''],
    website: [''],
    industry: [''],
    billingAddress: [''],
    notes: ['']
  });

  contactForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: [''],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    title: ['']
  });

  opportunityForm = this.fb.group({
    createOpportunity: [false],
    name: [''],
    amount: [0],
    status: ['OPEN'],
    expectedCloseDate: ['']
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<LeadConvertDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lead: any }
  ) {}

  ngOnInit(): void {
    this.api.getAccounts().subscribe((res) => {
      this.accounts = res;
      if (this.accounts.length) {
        this.accountForm.patchValue({ existingAccountId: this.accounts[0]._id });
      }
    });

    const lead = this.data.lead || {};
    const names = String(lead.title || '').trim().split(/\s+/).filter(Boolean);
    const firstName = names[0] || 'Lead';
    const lastName = names.slice(1).join(' ');

    this.contactForm.patchValue({
      firstName,
      lastName,
      email: lead.email || '',
      phone: lead.phone || ''
    });

    this.opportunityForm.patchValue({
      name: `${lead.title || 'Lead'} Opportunity`,
      amount: Number(lead.value || 0)
    });

    this.applyAccountModeValidation();
    this.accountForm.controls.accountMode.valueChanges.subscribe(() => this.applyAccountModeValidation());
  }

  applyAccountModeValidation(): void {
    const isExisting = this.accountForm.controls.accountMode.value === 'existing';
    const existingControl = this.accountForm.controls.existingAccountId;
    const nameControl = this.accountForm.controls.name;

    if (isExisting) {
      existingControl.setValidators([Validators.required]);
      nameControl.clearValidators();
    } else {
      nameControl.setValidators([Validators.required]);
      existingControl.clearValidators();
    }

    existingControl.updateValueAndValidity();
    nameControl.updateValueAndValidity();
  }

  convert(): void {
    if (this.accountForm.invalid || this.contactForm.invalid || this.opportunityInvalid()) {
      this.accountForm.markAllAsTouched();
      this.contactForm.markAllAsTouched();
      this.opportunityForm.markAllAsTouched();
      return;
    }

    const accountMode = this.accountForm.controls.accountMode.value || 'existing';
    const accountRaw = this.accountForm.getRawValue();
    const contactRaw = this.contactForm.getRawValue();
    const opportunityRaw = this.opportunityForm.getRawValue();

    const payload: any = {
      accountMode,
      existingAccountId: accountMode === 'existing' ? accountRaw.existingAccountId : undefined,
      account: accountMode === 'create' ? {
        name: accountRaw.name,
        email: accountRaw.email,
        phone: accountRaw.phone,
        website: accountRaw.website,
        industry: accountRaw.industry,
        billingAddress: accountRaw.billingAddress,
        notes: accountRaw.notes
      } : undefined,
      contact: {
        firstName: contactRaw.firstName,
        lastName: contactRaw.lastName,
        email: contactRaw.email,
        phone: contactRaw.phone,
        title: contactRaw.title
      },
      createOpportunity: !!opportunityRaw.createOpportunity,
      opportunity: opportunityRaw.createOpportunity ? {
        name: opportunityRaw.name,
        amount: Number(opportunityRaw.amount || 0),
        status: opportunityRaw.status,
        expectedCloseDate: opportunityRaw.expectedCloseDate || null
      } : undefined
    };

    this.dialogRef.close(payload);
  }

  opportunityInvalid(): boolean {
    if (!this.opportunityForm.controls.createOpportunity.value) {
      return false;
    }

    const name = this.opportunityForm.controls.name.value;
    return !String(name || '').trim();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
