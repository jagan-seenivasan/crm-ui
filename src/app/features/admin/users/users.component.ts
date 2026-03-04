import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { applyServerValidationErrors } from '../../../core/utils/form-error.util';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  error = '';

  form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['Password@123', [Validators.required, Validators.minLength(6)]],
    role: ['SALES', [Validators.required]]
  });

  constructor(private fb: FormBuilder, private api: ApiService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  invite(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.api.inviteUser(this.form.getRawValue()).subscribe({
      next: () => {
        this.form.patchValue({ name: '', email: '', password: 'Password@123', role: 'SALES' });
        this.form.markAsPristine();
        this.load();
      },
      error: (err) => {
        this.error = applyServerValidationErrors(this.form, err);
      }
    });
  }
}
