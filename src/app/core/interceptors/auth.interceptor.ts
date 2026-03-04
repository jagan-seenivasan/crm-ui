import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, finalize, switchMap, take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private session: SessionService, private auth: AuthService, private router: Router) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const request = this.addAuthHeaders(req);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isUnauthorized = error?.status === 401;
        if (!isUnauthorized || this.isAuthEndpoint(request.url)) {
          return throwError(() => error);
        }

        return this.handleUnauthorized(request, next, error);
      })
    );
  }

  private addAuthHeaders(req: HttpRequest<unknown>, tokenOverride?: string): HttpRequest<unknown> {
    const token = tokenOverride || this.session.accessToken;
    const tenantId = this.session.tenantId;
    const headers: Record<string, string> = { 'x-tenant-id': tenantId };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return req.clone({ setHeaders: headers });
  }

  private isAuthEndpoint(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/logout');
  }

  private handleUnauthorized(
    request: HttpRequest<unknown>,
    next: HttpHandler,
    originalError: HttpErrorResponse
  ): Observable<HttpEvent<unknown>> {
    const refreshToken = this.session.refreshToken;
    if (!refreshToken) {
      this.forceLogout();
      return throwError(() => originalError);
    }

    if (this.isRefreshing) {
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => next.handle(this.addAuthHeaders(request, token || undefined)))
      );
    }

    this.isRefreshing = true;
    this.refreshTokenSubject.next(null);

    return this.auth.refreshToken().pipe(
      switchMap((res) => {
        const newAccessToken = res?.accessToken;
        if (!newAccessToken) {
          this.forceLogout();
          return throwError(() => originalError);
        }

        this.refreshTokenSubject.next(newAccessToken);
        return next.handle(this.addAuthHeaders(request, newAccessToken));
      }),
      catchError((refreshError) => {
        this.forceLogout();
        return throwError(() => refreshError);
      }),
      finalize(() => {
        this.isRefreshing = false;
      })
    );
  }

  private forceLogout(): void {
    this.session.clear();
    this.router.navigate(['/auth/login']);
  }
}
