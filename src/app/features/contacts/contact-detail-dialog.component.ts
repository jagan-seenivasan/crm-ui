import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  templateUrl: './contact-detail-dialog.component.html',
  styleUrls: ['./contact-detail-dialog.component.css']
})
export class ContactDetailDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { contact: any }) {}

  ngOnInit(): void {}
}
