import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  templateUrl: './audit-logs.component.html',
  styleUrls: ['./audit-logs.component.css']
})
export class AuditLogsComponent implements OnInit {
  logs: any[] = [];
  error = '';
  page = 1;
  limit = 25;
  total = 0;
  totalPages = 1;

  filters: {
    action: string;
    entity: string;
    actorId: string;
    dateFrom: string;
    dateTo: string;
  } = {
    action: '',
    entity: '',
    actorId: '',
    dateFrom: '',
    dateTo: ''
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error = '';
    this.api
      .getAuditLogs({
        action: this.filters.action || undefined,
        entity: this.filters.entity || undefined,
        actorId: this.filters.actorId || undefined,
        dateFrom: this.filters.dateFrom || undefined,
        dateTo: this.filters.dateTo || undefined,
        page: this.page,
        limit: this.limit
      })
      .subscribe({
        next: (res) => {
          this.logs = res.items || [];
          this.total = res.total || 0;
          this.totalPages = res.totalPages || 1;
        },
        error: (err) => {
          this.error = err?.error?.message || 'Unable to load audit logs';
        }
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.load();
  }

  clearFilters(): void {
    this.filters = { action: '', entity: '', actorId: '', dateFrom: '', dateTo: '' };
    this.page = 1;
    this.load();
  }

  prevPage(): void {
    if (this.page <= 1) return;
    this.page -= 1;
    this.load();
  }

  nextPage(): void {
    if (this.page >= this.totalPages) return;
    this.page += 1;
    this.load();
  }
}
