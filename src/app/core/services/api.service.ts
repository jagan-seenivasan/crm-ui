import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> { return this.http.get(`${environment.apiBaseUrl}/dashboard`); }

  getLeads(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiBaseUrl}/leads`); }
  getLeadById(id: string): Observable<any | null> {
    return this.getLeads().pipe(map((leads) => leads.find((item) => item._id === id) || null));
  }
  createLead(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/leads`, payload); }

  getTasks(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiBaseUrl}/tasks`); }
  createTask(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/tasks`, payload); }

  getUsers(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiBaseUrl}/users`); }
  inviteUser(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/users`, payload); }

  getStages(): Observable<any[]> { return this.http.get<any[]>(`${environment.apiBaseUrl}/stages`); }
  createStage(payload: any): Observable<any> { return this.http.post(`${environment.apiBaseUrl}/stages`, payload); }
  updateStage(id: string, payload: any): Observable<any> {
    return this.http.patch(`${environment.apiBaseUrl}/stages/${id}`, payload);
  }
  deleteStage(id: string): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/stages/${id}`);
  }
}
