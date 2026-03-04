import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { applyServerValidationErrors } from '../../core/utils/form-error.util';

@Component({
  templateUrl: './lead-create.component.html',
  styleUrls: ['./lead-create.component.css']
})
export class LeadCreateComponent implements OnInit {
  error = '';
  users: any[] = [];
  stages: any[] = [];

  form = this.fb.group({
    title: ['', [Validators.required]],
    email: ['', [Validators.email]],
    phone: [''],
    company: [''],
    ownerId: ['', [Validators.required]],
    stageId: ['', [Validators.required]],
    value: [0, [Validators.min(0)]]
  });

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadDropdowns();
  }

  loadDropdowns(): void {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
    this.api.getStages('LEAD').subscribe((res) => {
      this.stages = res;
    });
  }

  create(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.createLead(this.form.getRawValue()).subscribe({
      next: () => this.router.navigate(['/leads']),
      error: (err) => {
        this.error = applyServerValidationErrors(this.form, err);
      }
    });
  }
}
