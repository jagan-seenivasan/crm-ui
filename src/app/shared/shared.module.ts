import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ActivityComponent } from './activity/activity.component';
import { ActivityTimelineComponent } from './activity-timeline/activity-timeline.component';

@NgModule({
  declarations: [ActivityComponent, ActivityTimelineComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ActivityComponent, ActivityTimelineComponent]
})
export class SharedModule {}
