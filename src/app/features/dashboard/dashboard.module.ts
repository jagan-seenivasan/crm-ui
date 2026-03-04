import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({ declarations: [DashboardComponent], imports: [CommonModule, MaterialModule, DashboardRoutingModule] })
export class DashboardModule {}
