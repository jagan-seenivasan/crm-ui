import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { LeadConvertDialogComponent } from './lead-convert-dialog.component';

@Component({
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent implements OnInit {
  lead: any | null = null;

  constructor(private route: ActivatedRoute, private api: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;
    this.load(id);
  }

  load(id: string): void {
    this.api.getLeadById(id).subscribe((res) => {
      this.lead = res;
    });
  }

  openConvert(): void {
    if (!this.lead || this.lead.isConverted) return;
    const dialogRef = this.dialog.open(LeadConvertDialogComponent, {
      width: '760px',
      data: { lead: this.lead }
    });

    dialogRef.afterClosed().subscribe((payload) => {
      if (!payload || !this.lead) return;
      this.api.convertLead(this.lead._id, payload).subscribe(() => this.load(this.lead._id));
    });
  }
}
