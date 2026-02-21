import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeadsComponent } from './leads.component';
import { LeadCreateComponent } from './lead-create.component';
import { LeadDetailComponent } from './lead-detail.component';
import { LeadsRoutingModule } from './leads-routing.module';
import { MaterialModule } from '../../shared/material.module';

@NgModule({
  declarations: [LeadsComponent, LeadCreateComponent, LeadDetailComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, LeadsRoutingModule]
})
export class LeadsModule {}
