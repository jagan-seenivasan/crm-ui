import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './opportunity-detail-dialog.component.html',
  styleUrls: ['./opportunity-detail-dialog.component.css']
})
export class OpportunityDetailDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { opportunity: any }) {}

  ngOnInit(): void {}
}
