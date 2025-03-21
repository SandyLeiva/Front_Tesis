import { Alumno } from './../../../../core/models/alumno.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { ToastrService } from 'ngx-toastr';
import { EstudiantesAddComponent } from '../estudiantes-add/estudiantes-add.component';
import { EstudiantesEditComponent } from '../estudiantes-edit/estudiantes-edit.component';
import { EstudiantesDeleteComponent } from '../estudiantes-delete/estudiantes-delete.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncabezadoDinamicoDirective } from '../../../../shared/directives/encabezado-dinamico.directive';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estudiantes-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, EstudiantesAddComponent, EstudiantesEditComponent, EstudiantesDeleteComponent, EncabezadoDinamicoDirective],
  templateUrl: './estudiantes-list.component.html',
  styleUrl: './estudiantes-list.component.css'
})
export class EstudiantesListComponent implements OnInit, OnChanges{
  @Input() enableSelection: boolean = false;
  alumnos: Alumno[] = [];
  padre: Alumno | null = null;

  searchText: string = '';
  selectedAlumno: Alumno | null = null;

  @Output() addAlumno = new EventEmitter<void>();
  @Output() editAlumno = new EventEmitter<Alumno>();
  @Output() deleteAlumno = new EventEmitter<Alumno>();
  @Output() alumnoGuardadoEvent = new EventEmitter<Alumno>();
  @Output() alumnoSeleccionadoEvent = new EventEmitter<Alumno>();

  @ViewChild(EstudiantesAddComponent) modalAdd!: EstudiantesAddComponent;
  @ViewChild(EstudiantesEditComponent) modalEdit!: EstudiantesEditComponent;
  @ViewChild(EstudiantesDeleteComponent) modalDelete!: EstudiantesDeleteComponent;

  encabezados: string[] = [
    'ID', 'Código', 'DNI', 'Nombres', 'Apellidos', 'Nivel', 'Sexo',
    'Fecha de Nacimiento', 'Grado', 'Seccion', 'Domicilio', 'Referencia', 'Seguro' , 'Discapacidad',  'Acciones'
  ];

  constructor(private alumnoService: AlumnoService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadAlumnos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['alumnos']) {
      this.loadAlumnos();
    }
  }

  loadAlumnos(): void {
    this.alumnoService.allAlumnos().subscribe(
      data => {
        this.alumnos = data;
      },
      error => {
        this.toastr.error('Error al cargar los alumnos');
        console.error('Error al cargar los alumnos:', error);
      }
    );
  }

    abrirPanelDelete(alumno: any) {
      Swal.fire({
        title: `¿Eliminar ${alumno.dni}?`,
        text: 'Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          if (alumno.id_alumno !== undefined) { // Usar padre.id_padre directamente
            this.alumnoService.deleteAlumno(alumno.id_alumno).subscribe(
              () => {
                Swal.fire('Eliminado', 'Padre eliminado correctamente.', 'success');
                this.recargar(); // Asegúrate de que este método recargue la lista
              },
              (error) => {
                Swal.fire('Error', 'No se pudo eliminar el padre.', 'error');
                console.error('Error al eliminar padre:', error);
              }
            );
          } else {
            console.error('El ID del padre es undefined');
          }
        }
      });
    }


  abrirModalEdit(alumno: Alumno) {
    this.selectedAlumno = { ...alumno };
    this.modalEdit.alumno = this.selectedAlumno;
    this.modalEdit.abrirModal();
  }

  abrirModalDelete(alumno: Alumno) {
    this.selectedAlumno = { ...alumno };
    this.modalDelete.alumno = this.selectedAlumno;
    this.modalDelete.abrirModal();
  }

  recargar() {
    this.loadAlumnos();
  }

  abrirModalAdd(): void {
    this.modalAdd.abrirModalAdd();
  }

  onAlumnoGuardado(alumno: Alumno): void {
    this.alumnos.push(alumno);
    this.alumnoGuardadoEvent.emit(alumno);
    this.recargar();
  }

  onAddAlumno() {
    this.addAlumno.emit();
  }

  onSelectAlumno(alumno: Alumno, event: Event): void {
    this.alumnoSeleccionadoEvent.emit(alumno);
  }

  selectAlumno(alumno: Alumno): void {
    this.alumnoSeleccionadoEvent.emit(alumno);
  }

  onEditPadre(alumno: Alumno): void {
    this.editAlumno.emit(alumno);
  }

  onDeletePadre(alumno: Alumno): void {
    this.deleteAlumno.emit(alumno);
  }


}
