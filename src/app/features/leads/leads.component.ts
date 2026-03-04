import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { LeadConvertDialogComponent } from './lead-convert-dialog.component';

@Component({
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {
  leads: any[] = [];
  savedFilters: any[] = [];
  selectedSavedFilterId = '';
  error = '';

  filters: { q: string; isConverted: string } = {
    q: '',
    isConverted: ''
  };

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.load();
    this.loadSavedFilters();
  }

  load(): void {
    this.error = '';
    const payload: any = {};
    if (this.filters.q) payload.q = this.filters.q;
    if (this.filters.isConverted) payload.isConverted = this.filters.isConverted;

    this.api.getLeads(payload).subscribe({
      next: (res) => {
        this.leads = res;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load leads';
      }
    });
  }

  loadSavedFilters(): void {
    this.api.getSavedFilters('LEADS').subscribe((res) => {
      this.savedFilters = res;
    });
  }

  applySavedFilter(id: string): void {
    this.selectedSavedFilterId = id;
    const found = this.savedFilters.find((item) => item._id === id);
    if (!found) return;
    this.filters = {
      q: found.filters?.q || '',
      isConverted: found.filters?.isConverted || ''
    };
    this.load();
  }

  saveCurrentFilter(): void {
    const name = window.prompt('Enter filter name');
    if (!name) return;
    this.api
      .createSavedFilter({
        module: 'LEADS',
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

  clearFilters(): void {
    this.filters = { q: '', isConverted: '' };
    this.load();
  }

  exportCsv(): void {
    const payload: any = {};
    if (this.filters.q) payload.q = this.filters.q;
    if (this.filters.isConverted) payload.isConverted = this.filters.isConverted;

    this.api.exportLeadsCsv(payload).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `leads-export-${new Date().toISOString().slice(0, 10)}.csv`;
        anchor.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to export leads';
      }
    });
  }

  openConvert(lead: any): void {
    if (lead.isConverted) return;

    const dialogRef = this.dialog.open(LeadConvertDialogComponent, {
      width: '760px',
      data: { lead }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload) return;
      this.api.convertLead(lead._id, payload).subscribe(() => this.load());
    });
  }
}
