import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { StagesComponent } from './stages/stages.component';
import { PermissionsComponent } from './permissions/permissions.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      { path: 'users', component: UsersComponent },
      { path: 'stages', component: StagesComponent },
      { path: 'permissions', component: PermissionsComponent },
      { path: 'audit-logs', component: AuditLogsComponent },
      { path: '', redirectTo: 'users', pathMatch: 'full' }
    ]
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class AdminRoutingModule {}
