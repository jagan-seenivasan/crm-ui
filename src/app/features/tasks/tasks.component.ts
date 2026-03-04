import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { SessionService } from '../../core/services/session.service';
import { TaskDeleteConfirmDialogComponent } from './task-delete-confirm-dialog.component';

type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | '';

@Component({
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: any[] = [];
  users: any[] = [];
  statusFilter: TaskStatus = '';
  assignedToFilter = '';
  error = '';

  constructor(private api: ApiService, private dialog: MatDialog, private session: SessionService) {}

  get canWrite(): boolean {
    const role = this.session.user?.role;
    return role === 'OWNER' || role === 'ADMIN' || role === 'MANAGER';
  }

  ngOnInit(): void {
    this.loadUsers();
    this.load();
  }

  loadUsers(): void {
    this.api.getUsers().subscribe({
      next: (res) => {
        this.users = res;
      },
      error: () => {
        this.users = [];
      }
    });
  }

  load(): void {
    this.error = '';
    const filters: { assignedTo?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' } = {};
    if (this.assignedToFilter) {
      filters.assignedTo = this.assignedToFilter;
    }
    if (this.statusFilter) {
      filters.status = this.statusFilter as 'TODO' | 'IN_PROGRESS' | 'DONE';
    }

    this.api.getTasks(filters).subscribe({
      next: (res) => {
        this.tasks = res;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load tasks';
      }
    });
  }

  setStatus(status: TaskStatus): void {
    this.statusFilter = status;
    this.load();
  }

  setAssignedTo(value: string): void {
    this.assignedToFilter = value;
    this.load();
  }

  applyMyTasks(): void {
    this.assignedToFilter = 'me';
    this.load();
  }

  clearFilters(): void {
    this.statusFilter = '';
    this.assignedToFilter = '';
    this.load();
  }

  openDelete(task: any): void {
    const dialogRef = this.dialog.open(TaskDeleteConfirmDialogComponent, {
      width: '420px',
      data: { title: task.title }
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.api.deleteTask(task._id).subscribe({
        next: () => this.load(),
        error: (err) => {
          this.error = err?.error?.message || 'Unable to delete task';
        }
      });
    });
  }
}
