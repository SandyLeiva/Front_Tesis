import { Injectable } from '@angular/core';
import { CristoReyService } from './cristo-rey.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { Padre } from '../models/padre.model';

@Injectable({
  providedIn: 'root'
})
export class PadreService extends CristoReyService{
  private padreUrl = 'padre/';

  constructor(private http: HttpClient) {
    super();
  }

  allPadres(): Observable<Padre[]> {
    return this.http.get<Padre[]>(this.baseUrl + this.padreUrl)
      .pipe(
        catchError(this.handleError<Padre[]>('allPadres', []))
      );
  }
  
  getPadre(id: number): Observable<Padre> {
    const url = `${this.baseUrl}${this.padreUrl}${id}/`;
    return this.http.get<Padre>(url)
      .pipe(
        catchError(this.handleError<Padre>(`getPadre id=${id}`))
      );
  }

  addPadre(padre: Padre): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Padre>(this.baseUrl + this.padreUrl, padre, httpOptions)
      .pipe(
        catchError(error => {
          this.handleError<any>('addPadre')
          console.error('Error en addPadre:', error);
          return throwError(error);
        })
      );
  }

  updatePadre(padre: Padre): Observable<any> {
    const url = `${this.baseUrl}${this.padreUrl}${padre.id_padre}/`;
    return this.http.put(url, padre)
      .pipe(
        catchError(error => {
          console.error('Error en updatePadre:', error);
          this.handleError<any>('updatePadre')
          return throwError(error);
      })
      );
  }

  deletePadre(id: number): Observable<any> {
    const url = `${this.baseUrl}${this.padreUrl}${id}/`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deletePadre'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);
      return throwError(() => error); // Enviar el error al componente
    };
  }


}
