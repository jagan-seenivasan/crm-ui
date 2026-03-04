import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AccountsComponent } from './accounts.component';
import { AccountDialogComponent } from './account-dialog.component';
import { AccountDetailComponent } from './account-detail.component';
import { AccountContactDialogComponent } from './account-contact-dialog.component';
import { MaterialModule } from '../../shared/material.module';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [AccountsComponent, AccountDialogComponent, AccountDetailComponent, AccountContactDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, SharedModule, AccountsRoutingModule]
})
export class AccountsModule {}
