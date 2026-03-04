import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SessionService } from '../../core/services/session.service';
import { OpportunityDialogComponent } from './opportunity-dialog.component';
import { OpportunityDetailDialogComponent } from './opportunity-detail-dialog.component';

@Component({
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {
  opportunities: any[] = [];
  stages: any[] = [];
  accounts: any[] = [];
  contacts: any[] = [];
  savedFilters: any[] = [];
  selectedSavedFilterId = '';
  error = '';
  private openedFromQuery = false;

  filters: {
    q: string;
    stageId: string;
    status: '' | 'OPEN' | 'WON' | 'LOST';
  } = {
    q: '',
    stageId: '',
    status: ''
  };

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
    this.loadAll();
    this.loadSavedFilters();
  }

  loadAll(): void {
    this.error = '';
    const payload: any = {};
    if (this.filters.q) payload.q = this.filters.q;
    if (this.filters.stageId) payload.stageId = this.filters.stageId;
    if (this.filters.status) payload.status = this.filters.status;

    this.api.getOpportunities(payload).subscribe((res) => {
      this.opportunities = res;
      const openId = this.route.snapshot.queryParamMap.get('open');
      if (openId && !this.openedFromQuery) {
        const match = this.opportunities.find((item) => item._id === openId);
        if (match) {
          this.openedFromQuery = true;
          this.openDetail(match);
        }
      }
    });
    this.api.getStages('OPPORTUNITY').subscribe((res) => (this.stages = res));
    this.api.getAccounts().subscribe((res) => (this.accounts = res));
    this.api.getContacts().subscribe((res) => (this.contacts = res));
  }

  clearFilters(): void {
    this.filters = { q: '', stageId: '', status: '' };
    this.loadAll();
  }

  loadSavedFilters(): void {
    this.api.getSavedFilters('OPPORTUNITIES').subscribe((res) => {
      this.savedFilters = res;
    });
  }

  applySavedFilter(id: string): void {
    this.selectedSavedFilterId = id;
    const found = this.savedFilters.find((item) => item._id === id);
    if (!found) return;
    this.filters = {
      q: found.filters?.q || '',
      stageId: found.filters?.stageId || '',
      status: found.filters?.status || ''
    };
    this.loadAll();
  }

  saveCurrentFilter(): void {
    const name = window.prompt('Enter filter name');
    if (!name) return;
    this.api
      .createSavedFilter({
        module: 'OPPORTUNITIES',
        name,
        filters: this.filters
      })
      .subscribe({
        next: () => this.loadSavedFilters(),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to save filter';
        }
      });
  }

  deleteSavedFilter(): void {
    if (!this.selectedSavedFilterId) return;
    const confirmDelete = window.confirm('Delete selected saved filter?');
    if (!confirmDelete) return;
    this.api.deleteSavedFilter(this.selectedSavedFilterId).subscribe({
      next: () => {
        this.selectedSavedFilterId = '';
        this.loadSavedFilters();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to delete saved filter';
      }
    });
  }

  exportCsv(): void {
    const payload: any = {};
    if (this.filters.q) payload.q = this.filters.q;
    if (this.filters.stageId) payload.stageId = this.filters.stageId;
    if (this.filters.status) payload.status = this.filters.status;

    this.api.exportOpportunitiesCsv(payload).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `opportunities-export-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to export opportunities';
      }
    });
  }

  openCreate(): void {
    const dialogRef = this.dialog.open(OpportunityDialogComponent, {
      width: '620px',
      data: { mode: 'create', stages: this.stages, accounts: this.accounts, contacts: this.contacts }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.createOpportunity(payload).subscribe({
        next: () => this.loadAll(),
        error: (err) => (this.error = err?.error?.message || 'Unable to create opportunity')
      });
    });
  }

  openEdit(opportunity: any): void {
    const dialogRef = this.dialog.open(OpportunityDialogComponent, {
      width: '620px',
      data: { mode: 'edit', opportunity, stages: this.stages, accounts: this.accounts, contacts: this.contacts }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.updateOpportunity(opportunity._id, payload).subscribe({
        next: () => this.loadAll(),
        error: (err) => (this.error = err?.error?.message || 'Unable to update opportunity')
      });
    });
  }

  openDetail(opportunity: any): void {
    this.dialog.open(OpportunityDetailDialogComponent, {
      width: '760px',
      data: { opportunity }
    });
  }
}
