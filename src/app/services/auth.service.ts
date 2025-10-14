import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginData, AuthResponse, Administrador } from '../models/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private tokenKey = 'fetagenda_token';
  private currentUserSubject = new BehaviorSubject<Administrador | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadStoredUser();
  }

  login(credentials: LoginData): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem('fetagenda_user', JSON.stringify(response.administrador));
          this.currentUserSubject.next(response.administrador);
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('fetagenda_user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getPerfil(): Observable<Administrador> {
    return this.http.get<Administrador>(`${this.apiUrl}/perfil`);
  }

  cambiarPassword(passwordActual: string, nuevoPassword: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/cambiar-password`, {
      passwordActual,
      nuevoPassword
    });
  }

  private loadStoredUser(): void {
    const userStr = localStorage.getItem('fetagenda_user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (e) {
        console.error('Error loading stored user', e);
      }
    }
  }
}
