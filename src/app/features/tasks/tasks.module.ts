import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TasksComponent } from './tasks.component';
import { TaskCreateComponent } from './task-create.component';
import { TaskDeleteConfirmDialogComponent } from './task-delete-confirm-dialog.component';
import { TasksRoutingModule } from './tasks-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [TasksComponent, TaskCreateComponent, TaskDeleteConfirmDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, TasksRoutingModule]
})
export class TasksModule {}
