import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeadsComponent } from './leads.component';
import { LeadCreateComponent } from './lead-create.component';
import { LeadDetailComponent } from './lead-detail.component';
import { LeadImportComponent } from './lead-import.component';

const routes: Routes = [
  { path: '', component: LeadsComponent },
  { path: 'new', component: LeadCreateComponent },
  { path: 'import', component: LeadImportComponent },
  { path: ':id', component: LeadDetailComponent }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class LeadsRoutingModule {}
