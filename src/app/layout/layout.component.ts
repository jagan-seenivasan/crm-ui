import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SessionService } from '../core/services/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  constructor(public session: SessionService, private auth: AuthService, private router: Router) {}

  logout(): void {
    this.auth.logout().subscribe({
      next: () => {
        this.session.clear();
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        this.session.clear();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
