import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AccountDetailComponent } from './account-detail.component';

const routes: Routes = [
  { path: '', component: AccountsComponent },
  { path: ':id', component: AccountDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule {}
