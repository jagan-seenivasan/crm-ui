import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { StagesComponent } from './stages/stages.component';
import { AdminRoutingModule } from './admin-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [AdminComponent, UsersComponent, StagesComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, AdminRoutingModule]
})
export class AdminModule {}
