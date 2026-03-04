import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../core/guards/auth.guard';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../features/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'leads',
        loadChildren: () => import('../features/leads/leads.module').then((m) => m.LeadsModule)
      },
      {
        path: 'tasks',
        loadChildren: () => import('../features/tasks/tasks.module').then((m) => m.TasksModule)
      },
      {
        path: 'accounts',
        loadChildren: () => import('../features/accounts/accounts.module').then((m) => m.AccountsModule),
        canActivate: [RoleGuard],
        data: { roles: ['OWNER', 'ADMIN', 'MANAGER', 'SALES'] }
      },
      {
        path: 'contacts',
        loadChildren: () => import('../features/contacts/contacts.module').then((m) => m.ContactsModule),
        canActivate: [RoleGuard],
        data: { roles: ['OWNER', 'ADMIN', 'MANAGER', 'SALES'] }
      },
      {
        path: 'opportunities',
        loadChildren: () => import('../features/opportunities/opportunities.module').then((m) => m.OpportunitiesModule),
        canActivate: [RoleGuard],
        data: { roles: ['OWNER', 'ADMIN', 'MANAGER', 'SALES'] }
      },
      {
        path: 'admin',
        loadChildren: () => import('../features/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [RoleGuard],
        data: { roles: ['OWNER', 'ADMIN', 'MANAGER'] }
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class LayoutRoutingModule {}
