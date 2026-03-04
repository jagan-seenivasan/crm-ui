import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from '../../shared/material.module';
import { OpportunitiesRoutingModule } from './opportunities-routing.module';
import { OpportunitiesComponent } from './opportunities.component';
import { OpportunityDialogComponent } from './opportunity-dialog.component';
import { OpportunitiesPipelineComponent } from './opportunities-pipeline.component';
import { OpportunityDetailDialogComponent } from './opportunity-detail-dialog.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [OpportunitiesComponent, OpportunityDialogComponent, OpportunitiesPipelineComponent, OpportunityDetailDialogComponent],
  imports: [CommonModule, ReactiveFormsModule, DragDropModule, MaterialModule, SharedModule, OpportunitiesRoutingModule]
})
export class OpportunitiesModule {}
