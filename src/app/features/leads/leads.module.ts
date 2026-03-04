import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LeadsComponent } from './leads.component';
import { LeadCreateComponent } from './lead-create.component';
import { LeadDetailComponent } from './lead-detail.component';
import { LeadConvertDialogComponent } from './lead-convert-dialog.component';
import { LeadImportComponent } from './lead-import.component';
import { LeadsRoutingModule } from './leads-routing.module';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [LeadsComponent, LeadCreateComponent, LeadDetailComponent, LeadConvertDialogComponent, LeadImportComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MaterialModule, SharedModule, LeadsRoutingModule]
})
export class LeadsModule {}
