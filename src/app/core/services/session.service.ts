import { Injectable } from '@angular/core';

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'SALES';
}

@Injectable({ providedIn: 'root' })
export class SessionService {
  get accessToken(): string | null { return localStorage.getItem('accessToken'); }
  get refreshToken(): string | null { return localStorage.getItem('refreshToken'); }
  get tenantId(): string { return localStorage.getItem('selectedTenantId') || 'demo-tenant'; }
  get user(): SessionUser | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  setSession(payload: { accessToken: string; refreshToken: string; user: SessionUser; tenantId: string }): void {
    localStorage.setItem('accessToken', payload.accessToken);
    localStorage.setItem('refreshToken', payload.refreshToken);
    localStorage.setItem('selectedTenantId', payload.tenantId);
    localStorage.setItem('user', JSON.stringify(payload.user));
  }

  updateTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clear(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedTenantId');
  }
}
