import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError,  map, of, throwError } from 'rxjs';
import { GradoAcademico } from '../models/grado-academico.model';
import { CristoReyService } from './cristo-rey.service';

@Injectable({
  providedIn: 'root'
})
export class GradoAcademicoService extends CristoReyService{

  private gradoUrl = 'grado-academico/';

  constructor(private http: HttpClient) {
    super()
  }

  allGrados(): Observable<GradoAcademico[]> {
    return this.http.get<GradoAcademico[]>(this.baseUrl + this.gradoUrl)
      .pipe(
        catchError(this.handleError<GradoAcademico[]>('allGrados', []))
      );
  }

  getGrado(id: number): Observable<GradoAcademico> {
    const url = `${this.baseUrl}${this.gradoUrl}${id}/`;
    return this.http.get<GradoAcademico>(url)
      .pipe(
        catchError(this.handleError<GradoAcademico>(`getNivel id=${id}`))
      );
  }

  addGrado(grado: GradoAcademico): Observable<GradoAcademico> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<GradoAcademico>(this.baseUrl + this.gradoUrl, grado, httpOptions)
      .pipe(
        catchError(error => {
          console.error('Error en addGrado:', error);
          return throwError(error); // Propagar error para que el componente lo capture
        })
      );
  }

  updateGrado(grado: GradoAcademico): Observable<any> {
    const url = `${this.baseUrl}${this.gradoUrl}${grado.id_grdacademico}/`;
    return this.http.put(url, grado)
      .pipe(
        catchError(error => {
          console.error('Error en updateGrado:', error);
          return throwError(error);
        })
      );
  }

  checkGradoExists(descripcion: string, id_nivel: number, gradoId: number): Observable<boolean> {
    const url = `${this.baseUrl}${this.gradoUrl}?descripcion=${descripcion}&id_nivel=${id_nivel}`;

    console.log(`Verificando existencia del grado académico con descripción: ${descripcion} y id_nivel: ${id_nivel}`);

    return this.http.get<GradoAcademico[]>(url).pipe(
      map(grados => {
        console.log(`Grados encontrados:`, grados);

        // Validamos correctamente cada grado de la respuesta
        const existe = grados.some(n =>
          n.descripcion.toLowerCase() === descripcion.toLowerCase() &&
          n.id_nivel === id_nivel &&
          n.id_grdacademico !== gradoId // Evitar que se compare consigo mismo
        );

        return existe;
      }),
      catchError(error => {
        console.error('Error en checkGradoExists:', error);
        return of(false);
      })
    );
  }

  deleteGrado(id: number): Observable<any> {
    const url = `${this.baseUrl}${this.gradoUrl}${id}/`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError<any>('deleteGrado'))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }

}
