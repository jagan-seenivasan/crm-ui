import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.css']
})
export class TaskCreateComponent implements OnInit {
  users: any[] = [];
  leads: any[] = [];
  error = '';

  form = this.fb.group({
    title: ['', [Validators.required]],
    assignedTo: ['', [Validators.required]],
    leadId: [''],
    dueDate: [''],
    status: ['TODO', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
    this.api.getLeads().subscribe((res) => {
      this.leads = res;
    });
  }

  create(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const payload = { ...raw, dueDate: raw.dueDate || null, leadId: raw.leadId || null };

    this.api.createTask(payload).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: (err) => {
        this.error = err?.error?.message || 'Unable to create task';
      }
    });
  }
}
