import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material.module';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsComponent } from './contacts.component';
import { ContactDialogComponent } from './contact-dialog.component';
import { ContactDetailDialogComponent } from './contact-detail-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ContactsComponent, ContactDialogComponent, ContactDetailDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, MaterialModule, SharedModule, ContactsRoutingModule]
})
export class ContactsModule {}
