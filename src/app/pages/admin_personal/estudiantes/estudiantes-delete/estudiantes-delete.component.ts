import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '../../../../core/models/alumno.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-estudiantes-delete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-delete.component.html',
  styleUrl: './estudiantes-delete.component.css'
})
export class EstudiantesDeleteComponent {

  @Input() alumno: Alumno | null = null;
  @Output() cerrarModalEvent = new EventEmitter<void>();
  @Output() eliminarAlumnoEvent = new EventEmitter<void>();

  isOpen = false;

  constructor(
    private alumnoService: AlumnoService,
    private toastr: ToastrService
  ) {}

  abrirModal() {
    this.isOpen = true;
  }

  cerrarModal() {
    this.isOpen = false;
    this.cerrarModalEvent.emit();
  }

  eliminarAlumno() {
    if (this.alumno && this.alumno.id_alumno !== undefined) {
      this.alumnoService.deleteAlumno(this.alumno.id_alumno).subscribe(
        () => {
          this.toastr.success('Alumno eliminado exitosamente');
          this.cerrarModal();
          this.eliminarAlumnoEvent.emit();
        },
        (error) => {
          this.toastr.error('Error al eliminar el alumno');
          console.error('Error al eliminar el alumno:', error);
        }
      );
    } else {
      console.error('ID del alumno no definido');
    }
  }
}
