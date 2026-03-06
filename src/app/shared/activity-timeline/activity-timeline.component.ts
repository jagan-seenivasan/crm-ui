import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

type TimelineEntityType = 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY';

@Component({
  selector: 'app-activity-timeline',
  templateUrl: './activity-timeline.component.html',
  styleUrls: ['./activity-timeline.component.css']
})
export class ActivityTimelineComponent implements OnChanges {
  @Input() entityType: TimelineEntityType | null = null;
  @Input() entityId: string | null = null;

  items: any[] = [];
  page = 1;
  readonly limit = 10;
  hasMore = false;
  loading = false;
  loadingMore = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['entityType'] || changes['entityId']) && this.entityType && this.entityId) {
      this.page = 1;
      this.items = [];
      this.hasMore = false;
      this.loadPage(false);
    }
  }

  loadMore(): void {
    if (this.loadingMore || !this.hasMore) {
      return;
    }
    this.page += 1;
    this.loadPage(true);
  }

  iconFor(type: string): string {
    if (type === 'NOTE') return 'sticky_note_2';
    if (type === 'TASK') return 'task_alt';
    if (type === 'AUDIT_LOG_CHANGE') return 'history';
    if (type === 'OPPORTUNITY_STAGE_CHANGE') return 'swap_horiz';
    if (type === 'LEAD_CONVERSION') return 'published_with_changes';
    return 'notifications';
  }

  trackByTimeline(_index: number, item: any): string {
    return `${item.type}-${item.createdAt}-${item.metadata?.noteId || item.metadata?.taskId || item.metadata?.entityId || ''}`;
  }

  private loadPage(isLoadMore: boolean): void {
    if (!this.entityType || !this.entityId) {
      return;
    }
    this.error = '';
    this.loading = !isLoadMore;
    this.loadingMore = isLoadMore;

    this.api.getActivityTimeline(this.entityType, this.entityId, this.page, this.limit).subscribe({
      next: (res) => {
        const nextItems = res?.items || [];
        this.items = isLoadMore ? [...this.items, ...nextItems] : nextItems;
        this.hasMore = !!res?.hasMore;
        this.loading = false;
        this.loadingMore = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Unable to load activity timeline';
        this.loading = false;
        this.loadingMore = false;
      }
    });
  }
}
