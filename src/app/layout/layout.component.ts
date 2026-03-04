import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { SessionService } from '../core/services/session.service';
import { ApiService } from '../core/services/api.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Leads', route: '/leads', icon: 'track_changes' },
    { label: 'Opportunities', route: '/opportunities', icon: 'monetization_on' },
    { label: 'Accounts', route: '/accounts', icon: 'business' },
    { label: 'Contacts', route: '/contacts', icon: 'people' },
    { label: 'Tasks', route: '/tasks', icon: 'checklist' },
    { label: 'Admin', route: '/admin/users', icon: 'admin_panel_settings' }
  ];

  searchText = '';
  searchResults: any[] = [];
  searchOpen = false;
  searchError = '';
  private searchTimer: any = null;

  constructor(
    public session: SessionService,
    private auth: AuthService,
    private api: ApiService,
    private router: Router
  ) {}

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

  onSearchInput(value: string): void {
    this.searchText = value;
    this.searchError = '';

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    const query = value.trim();
    if (query.length < 2) {
      this.searchResults = [];
      this.searchOpen = false;
      return;
    }

    this.searchTimer = setTimeout(() => {
      this.api.search(query, 6).subscribe({
        next: (res) => {
          this.searchResults = res.results || [];
          this.searchOpen = true;
        },
        error: (err) => {
          this.searchError = err?.error?.message || 'Search failed';
          this.searchResults = [];
          this.searchOpen = true;
        }
      });
    }, 220);
  }

  openResult(item: any): void {
    this.searchOpen = false;
    this.searchText = '';
    this.searchResults = [];

    if (item.entityType === 'LEAD') {
      this.router.navigate(['/leads', item.id]);
      return;
    }
    if (item.entityType === 'ACCOUNT') {
      this.router.navigate(['/accounts', item.id]);
      return;
    }
    if (item.entityType === 'CONTACT') {
      this.router.navigate(['/contacts'], { queryParams: { open: item.id } });
      return;
    }
    if (item.entityType === 'OPPORTUNITY') {
      this.router.navigate(['/opportunities'], { queryParams: { open: item.id } });
    }
  }

  @HostListener('document:click')
  closeSearch(): void {
    this.searchOpen = false;
  }

  stopClose(event: MouseEvent): void {
    event.stopPropagation();
  }
}
