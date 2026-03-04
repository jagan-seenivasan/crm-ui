import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnChanges {
  @Input() entityType: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY' | null = null;
  @Input() entityId: string | null = null;

  items: any[] = [];
  noteContent = '';
  error = '';

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['entityType'] || changes['entityId']) && this.entityType && this.entityId) {
      this.load();
    }
  }

  load(): void {
    if (!this.entityType || !this.entityId) return;
    this.error = '';
    this.api.getActivity(this.entityType, this.entityId).subscribe({
      next: (res) => {
        this.items = res?.items || [];
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load activity';
      }
    });
  }

  addNote(): void {
    if (!this.entityType || !this.entityId) return;
    const content = (this.noteContent || '').trim();
    if (!content) {
      this.error = 'Note content is required';
      return;
    }
    this.api.createNote({ entityType: this.entityType, entityId: this.entityId, content }).subscribe({
      next: () => {
        this.noteContent = '';
        this.load();
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to add note';
      }
    });
  }

  trackByIndex(index: number): number {
    return index;
  }
}
