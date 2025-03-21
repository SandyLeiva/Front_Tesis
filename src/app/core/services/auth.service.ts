import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { CristoReyService } from './cristo-rey.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends CristoReyService {

  private authUrl = 'login/';
  private refreshUrl = 'token/refresh/';

  constructor(private http: HttpClient) {
    super();
  }

  login(username: string, password: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(this.baseUrl + this.authUrl, { username, password }, httpOptions)
      .pipe(
        tap(res => {
          console.log('Login response:', res);
          if (res.access && res.refresh) {
            localStorage.setItem('access_token', res.access);
            localStorage.setItem('refresh_token', res.refresh);
            localStorage.setItem('username', res.username);
            localStorage.setItem('email', res.email);
            console.log('Tokens guardados:', localStorage.getItem('access_token'), localStorage.getItem('refresh_token'));
          }
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Error en la autenticación:', error);
          return of({ error: true, message: 'Credenciales inválidas' });
        })
      );
  }

  refreshToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(this.baseUrl + this.refreshUrl, { refresh: refreshToken }, httpOptions)
      .pipe(
        tap(res => {
          console.log('Refresh token response:', res);
          if (res.access) {
            localStorage.setItem('access_token', res.access);
            console.log('Token actualizado:', res.access);
          }
        }),
        catchError(error => {

          console.error('Error al refrescar token:', error);
          this.logout();
          return of(null);
        })
      );
  }

  logout(): void {

    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getEmail(): string | null {
    return localStorage.getItem('email');
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
