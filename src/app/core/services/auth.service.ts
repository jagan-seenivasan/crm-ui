import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, map, catchError } from 'rxjs';
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
    return this.http.post<any>(`${environment.apiBaseUrl}/auth/refresh`, { refreshToken: this.session.refreshToken }).pipe(
      tap((res) => {
        if (res?.accessToken && res?.refreshToken) {
          this.session.updateTokens(res.accessToken, res.refreshToken);
        }
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/auth/logout`, { refreshToken: this.session.refreshToken });
  }

  isAuthenticated(): boolean {
    const token = this.session.accessToken;
    return !!token && !this.isTokenExpired(token);
  }

  ensureValidSession(): Observable<boolean> {
    const accessToken = this.session.accessToken;
    const refreshToken = this.session.refreshToken;

    if (!accessToken && !refreshToken) {
      return of(false);
    }

    if (accessToken && !this.isTokenExpired(accessToken)) {
      return of(true);
    }

    if (!refreshToken || this.isTokenExpired(refreshToken)) {
      this.session.clear();
      return of(false);
    }

    return this.refreshToken().pipe(
      map((res) => !!res?.accessToken),
      catchError(() => {
        this.session.clear();
        return of(false);
      })
    );
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1] || ''));
      if (!payload?.exp) {
        return true;
      }
      return Date.now() >= payload.exp * 1000;
    } catch (_error) {
      return true;
    }
  }
}
