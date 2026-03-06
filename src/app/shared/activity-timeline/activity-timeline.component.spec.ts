import { of, throwError } from 'rxjs';
import { ActivityTimelineComponent } from './activity-timeline.component';

describe('ActivityTimelineComponent', () => {
  it('loads first page and stores items', () => {
    const apiMock = {
      getActivityTimeline: jasmine.createSpy('getActivityTimeline').and.returnValue(
        of({
          hasMore: true,
          items: [{ type: 'NOTE', title: 'Note added', createdAt: new Date().toISOString() }]
        })
      )
    };

    const component = new ActivityTimelineComponent(apiMock as any);
    component.entityType = 'LEAD';
    component.entityId = '507f1f77bcf86cd799439011';

    component.ngOnChanges({
      entityType: {
        currentValue: 'LEAD',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    } as any);

    expect(apiMock.getActivityTimeline).toHaveBeenCalled();
    expect(component.items.length).toBe(1);
    expect(component.hasMore).toBeTrue();
  });

  it('sets error when api fails', () => {
    const apiMock = {
      getActivityTimeline: jasmine.createSpy('getActivityTimeline').and.returnValue(
        throwError(() => ({ error: { message: 'Failed' } }))
      )
    };

    const component = new ActivityTimelineComponent(apiMock as any);
    component.entityType = 'LEAD';
    component.entityId = '507f1f77bcf86cd799439011';

    component.ngOnChanges({
      entityId: {
        currentValue: '507f1f77bcf86cd799439011',
        previousValue: null,
        firstChange: true,
        isFirstChange: () => true
      }
    } as any);

    expect(component.error).toBe('Failed');
  });
});
