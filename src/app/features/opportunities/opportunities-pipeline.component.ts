import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  templateUrl: './opportunities-pipeline.component.html',
  styleUrls: ['./opportunities-pipeline.component.css']
})
export class OpportunitiesPipelineComponent implements OnInit {
  stages: any[] = [];
  connectedDropListIds: string[] = [];
  opportunitiesByStage: Record<string, any[]> = {};
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.error = '';
    this.api.getStages('OPPORTUNITY').subscribe({
      next: (stages) => {
        this.stages = stages;
        this.connectedDropListIds = stages.map((stage) => stage._id);
        this.api.getOpportunities().subscribe({
          next: (opps) => {
            const map: Record<string, any[]> = {};
            this.stages.forEach((s) => {
              map[s._id] = [];
            });
            opps.forEach((opp) => {
              const key = opp.stageId?._id || opp.stageId;
              if (!map[key]) map[key] = [];
              map[key].push(opp);
            });
            this.opportunitiesByStage = map;
          },
          error: (err) => {
            this.error = err?.error?.message || 'Unable to load opportunities';
          }
        });
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load opportunity stages';
      }
    });
  }

  drop(event: CdkDragDrop<any[]>, targetStageId: string): void {
    if (event.previousContainer === event.container) {
      return;
    }

    const moved = event.previousContainer.data[event.previousIndex];
    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    this.api.moveOpportunityStage(moved._id, targetStageId).subscribe({
      error: (err) => {
        this.error = err?.error?.message || 'Unable to move opportunity stage';
        this.load();
      }
    });
  }
}
