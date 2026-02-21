import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private session: SessionService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.session.accessToken;
    const tenantId = localStorage.getItem('selectedTenantId') || this.session.tenantId;
    const headers: Record<string, string> = { 'x-tenant-id': tenantId };
    if (token) headers.Authorization = `Bearer ${token}`;

    return next.handle(req.clone({ setHeaders: headers }));
  }
}
