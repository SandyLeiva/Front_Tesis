import { Component, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavPaginationComponent } from '../../../shared/components/navPagination/navPagination.component';
import { EstudiantesListComponent } from './estudiantes-list/estudiantes-list.component';
import { Alumno } from '../../../core/models/alumno.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, EstudiantesListComponent, FormsModule],
  templateUrl: './estudiantes.component.html',
  styleUrl: './estudiantes.component.css'
})
export class EstudiantesComponent {
  alumnos: Alumno[] = [];
  @ViewChild(EstudiantesListComponent) alumnosList!: EstudiantesListComponent;

}
