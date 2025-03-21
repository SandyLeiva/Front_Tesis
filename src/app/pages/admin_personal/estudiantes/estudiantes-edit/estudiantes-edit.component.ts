import { AlumnoService } from './../../../../core/services/alumno.service';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '../../../../core/models/alumno.model';
import { NivelEducativoService } from '../../../../core/services/nivel-educativo.service';
import { GradoAcademicoService } from '../../../../core/services/grado-academico.service';
import { ToastrService } from 'ngx-toastr';
import { NivelAcademico } from '../../../../core/models/nivel-academico.model';
import { GradoAcademico } from '../../../../core/models/grado-academico.model';

@Component({
  selector: 'app-estudiantes-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-edit.component.html',
  styleUrls: ['./estudiantes-edit.component.css']
})
export class EstudiantesEditComponent implements OnInit {
  @Input() alumno: Alumno | null = null;
  @Output() cerrarModalEvent = new EventEmitter<void>();
  @Output() actualizarAlumnoEvent = new EventEmitter<void>();

  isOpen = false;
  niveles: NivelAcademico[] = [];
  nivelSeleccionado: NivelAcademico | null = null;

  grados: GradoAcademico[] = [];
  gradoSeleccionado: GradoAcademico | null = null;

  constructor(
    private nivelEducativoService: NivelEducativoService,
    private gradoAcademicoService: GradoAcademicoService,
    private alumnoService: AlumnoService,
    private toastr: ToastrService
  ) {}

  abrirModal(): void {
    this.isOpen = true;
    this.cargarNiveles();
    this.cargarGrados();
    if (this.alumno) {
      this.nivelSeleccionado = this.niveles.find(nivel => nivel.id_nivelacademico === this.alumno?.nivel) || null;
      this.gradoSeleccionado = this.grados.find(grado => grado.id_grdacademico === this.alumno?.grado) || null;
    }
  }
  cerrarModal(): void {
    this.isOpen = false;
    this.cerrarModalEvent.emit();
  }

  ngOnInit(): void {
    this.cargarNiveles();
    this.cargarGrados();
  }

  cargarNiveles(): void {
    this.nivelEducativoService.allNiveles().subscribe(niveles => {
      this.niveles = niveles;
      if (this.alumno) {
        this.nivelSeleccionado = this.niveles.find(nivel => nivel.id_nivelacademico === this.alumno?.nivel) || null;
      }
    });
  }

  cargarGrados(): void {
    this.gradoAcademicoService.allGrados().subscribe(grados => {
      this.grados = grados;
      if (this.alumno) {
        this.gradoSeleccionado = this.grados.find(grado => grado.id_grdacademico === this.alumno?.grado) || null;
      }
    });
  }

  updateAlumno(event: Event, field: keyof Alumno) {
    const input = event.target as HTMLInputElement;
    if (this.alumno) {
      (this.alumno[field] as unknown as string) = input.value;
    }
  }

  actualizarAlumno() {
    if (this.alumno) {
      this.alumno.nivel = this.nivelSeleccionado?.id_nivelacademico || this.alumno.nivel;
      this.alumno.grado = this.gradoSeleccionado?.id_grdacademico || this.alumno.grado;
      this.alumnoService.updateAlumno(this.alumno).subscribe(
        () => {
          this.toastr.success('Alumno actualizado exitosamente');
          this.cerrarModal();
          this.actualizarAlumnoEvent.emit();
        },
        (error) => {
          this.toastr.error('Error al actualizar el alumno');
          console.error('Error al actualizar el alumno:', error);
        }
      );
    }
  }
}
