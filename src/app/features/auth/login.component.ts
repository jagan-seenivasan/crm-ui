import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { applyServerValidationErrors } from '../../core/utils/form-error.util';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  error = '';

  form = this.fb.group({
    tenantId: ['demo-tenant', [Validators.required]],
    email: ['owner@demo.com', [Validators.required, Validators.email]],
    password: ['Password@123', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, password, tenantId } = this.form.getRawValue();
    this.auth.login(email || '', password || '', tenantId || '').subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (e) => {
        this.error = applyServerValidationErrors(this.form, e);
      }
    });
  }
}
