import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpportunitiesComponent } from './opportunities.component';
import { OpportunitiesPipelineComponent } from './opportunities-pipeline.component';

const routes: Routes = [
  { path: '', component: OpportunitiesComponent },
  { path: 'pipeline', component: OpportunitiesPipelineComponent }
];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class OpportunitiesRoutingModule {}
