import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { SessionService } from '../../core/services/session.service';
import { AccountContactDialogComponent } from './account-contact-dialog.component';

@Component({
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.css']
})
export class AccountDetailComponent implements OnInit {
  account: any | null = null;
  contacts: any[] = [];
  error = '';

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private session: SessionService,
    private dialog: MatDialog
  ) {}

  get canWrite(): boolean {
    const role = this.session.user?.role;
    return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER';
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.load(id);
  }

  load(accountId: string): void {
    this.error = '';
    this.api.getAccountById(accountId).subscribe((res) => {
      this.account = res;
    });

    this.api.getContacts(accountId).subscribe({
      next: (res) => {
        this.contacts = res;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load contacts';
      }
    });
  }

  openAddContact(): void {
    if (!this.account?._id) return;

    const dialogRef = this.dialog.open(AccountContactDialogComponent, {
      width: '560px',
      data: { accountId: this.account._id }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.createContact(payload).subscribe({
        next: () => this.load(this.account._id),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to create contact';
        }
      });
    });
  }
}
