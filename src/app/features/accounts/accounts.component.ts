import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { SessionService } from '../../core/services/session.service';
import { AccountDialogComponent } from './account-dialog.component';

@Component({
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  accounts: any[] = [];
  error = '';

  constructor(
    private api: ApiService,
    private session: SessionService,
    private dialog: MatDialog
  ) {}

  get canWrite(): boolean {
    const role = this.session.user?.role;
    return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER';
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error = '';
    this.api.getAccounts().subscribe({
      next: (res) => {
        this.accounts = res;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load accounts';
      }
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '560px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.createAccount(payload).subscribe({
        next: () => this.load(),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to create account';
        }
      });
    });
  }

  openEdit(account: any): void {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '560px',
      data: { mode: 'edit', account }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.updateAccount(account._id, payload).subscribe({
        next: () => this.load(),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to update account';
        }
      });
    });
  }

  deleteAccount(account: any): void {
    if (!confirm(`Delete account \"${account.name}\"?`)) {
      return;
    }

    this.api.deleteAccount(account._id).subscribe({
      next: () => this.load(),
      error: (err) => {
        this.error = err?.error?.message || 'Unable to delete account';
      }
    });
  }
}
