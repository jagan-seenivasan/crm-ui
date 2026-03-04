import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SessionService } from '../../core/services/session.service';
import { ContactDialogComponent } from './contact-dialog.component';
import { ContactDetailDialogComponent } from './contact-detail-dialog.component';

@Component({
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.css']
})
export class ContactsComponent implements OnInit {
  contacts: any[] = [];
  error = '';
  private openedFromQuery = false;

  constructor(
    private api: ApiService,
    private session: SessionService,
    private dialog: MatDialog,
    private route: ActivatedRoute
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
    this.api.getContacts().subscribe({
      next: (res) => {
        this.contacts = res;
        const openId = this.route.snapshot.queryParamMap.get('open');
        if (openId && !this.openedFromQuery) {
          const match = this.contacts.find((item) => item._id === openId);
          if (match) {
            this.openedFromQuery = true;
            this.openDetail(match);
          }
        }
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load contacts';
      }
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(ContactDialogComponent, { width: '560px', data: { mode: 'create' } });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      const accountId = this.contacts[0]?.accountId?._id || this.contacts[0]?.accountId;
      if (!accountId) {
        this.error = 'No account context found. Add contact from Account detail page.';
        return;
      }
      this.api.createContact({ ...payload, accountId }).subscribe({
        next: () => this.load(),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to create contact';
        }
      });
    });
  }

  openDetail(contact: any): void {
    this.dialog.open(ContactDetailDialogComponent, {
      width: '700px',
      data: { contact }
    });
  }
}
