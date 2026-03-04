import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  templateUrl: './task-delete-confirm-dialog.component.html',
  styleUrls: ['./task-delete-confirm-dialog.component.css']
})
export class TaskDeleteConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<TaskDeleteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string }
  ) {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
