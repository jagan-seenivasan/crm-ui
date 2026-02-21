import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private session: SessionService) {}

  login(email: string, password: string, tenantId: string): Observable<any> {
    localStorage.setItem('selectedTenantId', tenantId);
    return this.http.post<any>(`${environment.apiBaseUrl}/auth/login`, { email, password }).pipe(
      tap((res) => {
        this.session.setSession({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          user: res.user,
          tenantId
        });
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken: this.session.refreshToken });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/logout`, { refreshToken: this.session.refreshToken });
  }

  isAuthenticated(): boolean {
    return !!this.session.accessToken;
  }
}
