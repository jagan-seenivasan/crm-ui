import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';

@Component({
  templateUrl: './opportunity-detail-dialog.component.html',
  styleUrls: ['./opportunity-detail-dialog.component.css']
})
export class OpportunityDetailDialogComponent implements OnInit {
  stageHistory: any[] = [];
  loadingHistory = false;
  historyError = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { opportunity: any },
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.loadStageHistory();
  }

  private loadStageHistory(): void {
    const opportunityId = this.data?.opportunity?._id;
    if (!opportunityId) {
      return;
    }

    this.loadingHistory = true;
    this.historyError = '';

    this.api.getOpportunityStageHistory(opportunityId).subscribe({
      next: (items) => {
        this.stageHistory = items || [];
        this.loadingHistory = false;
      },
      error: (err) => {
        this.historyError = err?.error?.message || 'Unable to load stage history';
        this.loadingHistory = false;
      }
    });
  }
}
