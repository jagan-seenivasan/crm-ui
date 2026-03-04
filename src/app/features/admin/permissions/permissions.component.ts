import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css']
})
export class PermissionsComponent implements OnInit {
  roles: string[] = [];
  entries: Array<{ key: string; module: string; action: string; roles: string[] }> = [];
  permissions: Record<string, string[]> = {};
  loading = false;
  error = '';
  success = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.api.getPermissionConfig().subscribe({
      next: (res) => {
        this.roles = res.roles || [];
        this.permissions = { ...(res.permissions || {}) };
        this.entries = (res.entries || []).map((item) => ({ ...item, roles: [...(item.roles || [])] }));
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load permissions';
        this.loading = false;
      }
    });
  }

  hasRole(permissionKey: string, role: string): boolean {
    return (this.permissions[permissionKey] || []).includes(role);
  }

  toggleRole(permissionKey: string, role: string, checked: boolean): void {
    const current = new Set(this.permissions[permissionKey] || []);
    if (checked) {
      current.add(role);
    } else {
      current.delete(role);
    }
    this.permissions[permissionKey] = Array.from(current);
  }

  save(): void {
    this.error = '';
    this.success = '';
    this.api.updatePermissionConfig(this.permissions).subscribe({
      next: () => {
        this.success = 'Permissions updated';
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to update permissions';
      }
    });
  }
}
