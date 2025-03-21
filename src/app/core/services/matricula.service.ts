import { Injectable } from '@angular/core';
import { CristoReyService } from './cristo-rey.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Matricula } from '../models/matricula.model';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService extends CristoReyService{

  private matriculaUrl = 'matricula-general/'

  constructor(private http: HttpClient) {
    super()
   }

   allMatriculas(): Observable<Matricula[]> {
    return this.http.get<Matricula[]>(this.baseUrl + this.matriculaUrl)
      .pipe(
        catchError(this.handleError<Matricula[]>('allMatriculas', []))
      );
  }

  getMatricula(id: number): Observable<Matricula> {
    const url = `${this.baseUrl}${this.matriculaUrl}${id}/`;
    return this.http.get<Matricula>(url)
      .pipe(
        catchError(this.handleError<Matricula>(`getMatricula id=${id}`))
      );
  }

  addMatricula(matricula: Matricula): Observable<Matricula> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<Matricula>(this.baseUrl + this.matriculaUrl, matricula, httpOptions)
      .pipe(
        catchError(this.handleError<Matricula>('addMatricula'))
      );
  }

  updateMatricula(matricula: Matricula): Observable<any> {
    const url = `${this.baseUrl}${this.matriculaUrl}${matricula.id_matricula}/`;
    return this.http.put(url, matricula)
      .pipe(
        catchError(this.handleError<any>('updateMatricula'))
      );
  }

  deleteAlumno(id: number): Observable<any> {
    const url = `${this.baseUrl}${this.matriculaUrl}${id}/`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteMatricula'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
