import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ActivityComponent } from './activity/activity.component';

@NgModule({
  declarations: [ActivityComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ActivityComponent]
})
export class SharedModule {}
