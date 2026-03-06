import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> { return this.http.get(`${environment.apiBaseUrl}/dashboard`); }

  getLeads(filters?: { q?: string; stageId?: string; ownerId?: string; isConverted?: string }): Observable<any[]> {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.stageId) params.set('stageId', filters.stageId);
    if (filters?.ownerId) params.set('ownerId', filters.ownerId);
    if (filters?.isConverted) params.set('isConverted', filters.isConverted);
    const query = params.toString();
    const url = query ? `${environment.apiBaseUrl}/leads?${query}` : `${environment.apiBaseUrl}/leads`;
    return this.http.get<any[]>(url);
  }
  getLeadById(id: string): Observable<any | null> {
    return this.getLeads().pipe(map((leads) => leads.find((item) => item._id === id) || null));
  }
  createLead(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/leads`, payload); }
  convertLead(id: string, payload: any): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/leads/${id}/convert`, payload);
  }
  exportLeadsCsv(filters?: { q?: string; stageId?: string; ownerId?: string; isConverted?: string }): Observable<Blob> {
    const params = new URLSearchParams();
    if (filters?.q) params.set('q', filters.q);
    if (filters?.stageId) params.set('stageId', filters.stageId);
    if (filters?.ownerId) params.set('ownerId', filters.ownerId);
    if (filters?.isConverted) params.set('isConverted', filters.isConverted);
    const query = params.toString();
    const url = query ? `${environment.apiBaseUrl}/leads/export?${query}` : `${environment.apiBaseUrl}/leads/export`;
    return this.http.get(url, { responseType: 'blob' });
  }
  importLeadsCsv(file: File, options: { dryRun: boolean; mapping?: any; defaults?: any }): Observable<any> {
    const form = new FormData();
    form.append('file', file);
    form.append('dryRun', options.dryRun ? 'true' : 'false');
    if (options.mapping) form.append('mapping', JSON.stringify(options.mapping));
    if (options.defaults) form.append('defaults', JSON.stringify(options.defaults));
    return this.http.post<any>(`${environment.apiBaseUrl}/leads/import`, form);
  }

  getTasks(filters?: { assignedTo?: string; status?: 'TODO' | 'IN_PROGRESS' | 'DONE' }): Observable<any[]> {
    const params = new URLSearchParams();
    if (filters?.assignedTo) params.set('assignedTo', filters.assignedTo);
    if (filters?.status) params.set('status', filters.status);
    const query = params.toString();
    const url = query ? `${environment.apiBaseUrl}/tasks?${query}` : `${environment.apiBaseUrl}/tasks`;
    return this.http.get<any[]>(url);
  }
  createTask(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/tasks`, payload); }
  deleteTask(id: string): Observable<any> { return this.http.delete(`${environment.apiBaseUrl}/tasks/${id}`); }
  getOpportunities(filters?: string | { stageId?: string; accountId?: string; status?: 'OPEN' | 'WON' | 'LOST'; q?: string }): Observable<any[]> {
    if (typeof filters === 'string') {
      return this.http.get<any[]>(`${environment.apiBaseUrl}/opportunities?stageId=${filters}`);
    }
    const params = new URLSearchParams();
    if (filters?.stageId) params.set('stageId', filters.stageId);
    if (filters?.accountId) params.set('accountId', filters.accountId);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.q) params.set('q', filters.q);
    const query = params.toString();
    const url = query ? `${environment.apiBaseUrl}/opportunities?${query}` : `${environment.apiBaseUrl}/opportunities`;
    return this.http.get<any[]>(url);
  }
  createOpportunity(payload: any): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/opportunities`, payload);
  }
  updateOpportunity(id: string, payload: any): Observable<any> {
    return this.http.patch<any>(`${environment.apiBaseUrl}/opportunities/${id}`, payload);
  }
  moveOpportunityStage(id: string, stageId: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiBaseUrl}/opportunities/${id}/stage`, { stageId });
  }
  exportOpportunitiesCsv(filters?: { stageId?: string; accountId?: string; status?: 'OPEN' | 'WON' | 'LOST'; q?: string }): Observable<Blob> {
    const params = new URLSearchParams();
    if (filters?.stageId) params.set('stageId', filters.stageId);
    if (filters?.accountId) params.set('accountId', filters.accountId);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.q) params.set('q', filters.q);
    const query = params.toString();
    const url = query ? `${environment.apiBaseUrl}/opportunities/export?${query}` : `${environment.apiBaseUrl}/opportunities/export`;
    return this.http.get(url, { responseType: 'blob' });
  }
  getAccounts(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiBaseUrl}/accounts`); }
  getAccountById(id: string): Observable<any | null> {
    return this.getAccounts().pipe(map((accounts) => accounts.find((item) => item._id === id) || null));
  }
  createAccount(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/accounts`, payload); }
  updateAccount(id: string, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/accounts/${id}`, payload);
  }
  deleteAccount(id: string): Observable<any> { return this.http.delete(`${environment.apiBaseUrl}/accounts/${id}`); }
  getContacts(accountId?: string): Observable<any[]> {
    if (!accountId) {
      return this.http.get<any[]>(`${environment.apiBaseUrl}/contacts`);
    }
    return this.http.get<any[]>(`${environment.apiBaseUrl}/contacts?accountId=${accountId}`);
  }
  createContact(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/contacts`, payload); }
  updateContact(id: string, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/contacts/${id}`, payload);
  }
  deleteContact(id: string): Observable<any> { return this.http.delete(`${environment.apiBaseUrl}/contacts/${id}`); }

  getUsers(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiBaseUrl}/users`); }
  inviteUser(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/users`, payload); }

  getStages(type?: 'LEAD' | 'OPPORTUNITY'): Observable<any[]> {
    if (!type) {
      return this.http.get<any[]>(`${environment.apiBaseUrl}/stages`);
    }
    return this.http.get<any[]>(`${environment.apiBaseUrl}/stages?type=${type}`);
  }
  createStage(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/stages`, payload); }
  updateStage(id: string, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/stages/${id}`, payload);
  }
  deleteStage(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/stages/${id}`);
  }

  getNotes(entityType: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY', entityId: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/notes?entityType=${entityType}&entityId=${entityId}`);
  }

  createNote(payload: {
    entityType: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY';
    entityId: string;
    content: string;
  }): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/notes`, payload);
  }

  getActivity(entityType: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY', entityId: string): Observable<any> {
    return this.http.get<any>(`${environment.apiBaseUrl}/activity?entityType=${entityType}&entityId=${entityId}`);
  }

  getActivityTimeline(
    entityType: 'LEAD' | 'ACCOUNT' | 'CONTACT' | 'OPPORTUNITY',
    entityId: string,
    page = 1,
    limit = 10
  ): Observable<any> {
    const params = new URLSearchParams();
    params.set('entityType', entityType);
    params.set('entityId', entityId);
    params.set('page', String(page));
    params.set('limit', String(limit));
    return this.http.get<any>(`${environment.apiBaseUrl}/activity-timeline?${params.toString()}`);
  }

  search(q: string, limit = 5): Observable<{ query: string; results: any[] }> {
    const query = encodeURIComponent(q);
    return this.http.get<{ query: string; results: any[] }>(`${environment.apiBaseUrl}/search?q=${query}&limit=${limit}`);
  }

  getSavedFilters(module: 'LEADS' | 'OPPORTUNITIES'): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBaseUrl}/saved-filters?module=${module}`);
  }

  createSavedFilter(payload: { module: 'LEADS' | 'OPPORTUNITIES'; name: string; filters: any }): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/saved-filters`, payload);
  }

  updateSavedFilter(id: string, payload: { name?: string; filters?: any }): Observable<any> {
    return this.http.patch<any>(`${environment.apiBaseUrl}/saved-filters/${id}`, payload);
  }

  deleteSavedFilter(id: string): Observable<any> {
    return this.http.delete<any>(`${environment.apiBaseUrl}/saved-filters/${id}`);
  }

  getPermissionConfig(): Observable<{ roles: string[]; permissions: Record<string, string[]>; entries: any[] }> {
    return this.http.get<{ roles: string[]; permissions: Record<string, string[]>; entries: any[] }>(
      `${environment.apiBaseUrl}/permission-config`
    );
  }

  updatePermissionConfig(permissions: Record<string, string[]>): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/permission-config`, { permissions });
  }

  getAuditLogs(filters?: {
    action?: string;
    entity?: string;
    entityId?: string;
    actorId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }): Observable<any> {
    const params = new URLSearchParams();
    if (filters?.action) params.set('action', filters.action);
    if (filters?.entity) params.set('entity', filters.entity);
    if (filters?.entityId) params.set('entityId', filters.entityId);
    if (filters?.actorId) params.set('actorId', filters.actorId);
    if (filters?.dateFrom) params.set('dateFrom', filters.dateFrom);
    if (filters?.dateTo) params.set('dateTo', filters.dateTo);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    const query = params.toString();
    const url = query ? `${environment.apiBaseUrl}/audit-logs?${query}` : `${environment.apiBaseUrl}/audit-logs`;
    return this.http.get<any>(url);
  }
}
