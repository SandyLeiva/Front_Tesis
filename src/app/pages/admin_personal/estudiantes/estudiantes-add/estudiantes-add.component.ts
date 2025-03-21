import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Alumno } from '../../../../core/models/alumno.model';
import { AlumnoService } from '../../../../core/services/alumno.service';
import { NivelAcademico } from '../../../../core/models/nivel-academico.model';
import { GradoAcademico } from '../../../../core/models/grado-academico.model';
import { NivelEducativoService } from '../../../../core/services/nivel-educativo.service';
import { GradoAcademicoService } from '../../../../core/services/grado-academico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estudiantes-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiantes-add.component.html',
  styleUrl: './estudiantes-add.component.css'
})
export class EstudiantesAddComponent implements OnInit {

  niveles: NivelAcademico[] = [];
  nivelSeleccionado: NivelAcademico | null = null;

  grados: GradoAcademico[] = [];
  gradoSeleccionado: GradoAcademico | null = null;

  alumnos: Alumno[] = [];

  alumno: Alumno = {
    codigo: '',
    dni: '',
    nombres: '',
    apellidos: '',
    nivel: 0,
    sexo: '',
    fecha_nacimiento: '',
    grado: 0,
    seccion: '',
    domicilio_actual: '',
    referencia: '',
    tipo_seguro: '',
    discapacidad: false  // Cambiado a booleano
  };

  isOpen = false;
  fechaMaximaPermitida: string = '';

  @Output() alumnoGuardadoEvent = new EventEmitter<Alumno>();
  @Output() cerrarModalEvent = new EventEmitter<void>();

  constructor(
    private nivelEducativoService: NivelEducativoService,
    private gradoAcademicoService: GradoAcademicoService,
    private alumnoService: AlumnoService
  ) {
    this.calcularFechaMaxima();
  }

  calcularFechaMaxima(): void {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18); // Restar 18 años
    this.fechaMaximaPermitida = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  ngOnInit(): void {
    this.cargarNiveles();
    this.cargarGrados();
  }

  cargarNiveles(): void {
    this.nivelEducativoService.allNiveles().subscribe(niveles => {
      this.niveles = niveles;
      if (this.niveles.length > 0) {
        this.nivelSeleccionado = this.niveles[0];
      }
    });
  }

  cargarGrados(): void {
    this.gradoAcademicoService.allGrados().subscribe(
      grados => {
        this.grados = grados;
        if (this.grados.length > 0) {
          this.gradoSeleccionado = this.grados[0];
        } else {
          this.gradoSeleccionado = null;
        }
      },
      error => {
        console.error('Error al cargar los grados:', error);
      }
    );
  }

  abrirModalAdd(): void {
    this.isOpen = true;
  }

  cerrarModal(): void {
    this.isOpen = false;
    this.limpiarCampos();
    this.cerrarModalEvent.emit();
  }

  limpiarCampos(): void {
    this.alumno = {
      codigo: '',
      dni: '',
      nombres: '',
      apellidos: '',
      nivel: this.nivelSeleccionado?.id_nivelacademico || 0,
      sexo: '',
      fecha_nacimiento: '',
      grado: this.gradoSeleccionado?.id_grdacademico || 0,
      seccion: '',
      domicilio_actual: '',
      referencia: '',
      tipo_seguro: '',
      discapacidad: false
    };
  }


  guardarAlumno(): void {
    console.log('Datos enviados:', this.alumno);

    if (!this.alumno.dni) {
      Swal.fire('Advertencia', 'El dni es obligatorio.', 'warning');
      return;
    }

    if (!this.alumno.dni || this.alumno.dni.length !== 8) {
      Swal.fire('Error', 'El DNI debe tener 8 dígitos.', 'warning');
      return;
    }

    const dniExiste = this.alumnos.some(n => n.dni === this.alumno.dni);
      if (dniExiste) {
        Swal.fire('Error', 'El nombre del nivel académico ya existe.', 'warning');
        return;
    }

    if (!this.alumno.sexo) {
      Swal.fire('Advertencia', 'El sexo del estudiante es obligatorio.', 'warning');
      return;
    }
    if (!this.alumno.fecha_nacimiento) {
      Swal.fire('Advertencia', 'La fecha de nacimiento es obligatoria.', 'warning');
      return;
    }
    if (!this.alumno.seccion) {
      Swal.fire('Advertencia', 'La sección es obligatoria.', 'warning');
      return;
    }
    if (!this.validarMayorDeEdad(this.alumno.fecha_nacimiento)) {
      Swal.fire('Error', 'El alumno debe ser menor de 18 años.', 'error');
      return;
    }

    this.alumno.discapacidad = this.alumno.discapacidad || false;
    this.alumno.tipo_seguro = this.alumno.tipo_seguro || "Sin datos";
    this.alumno.referencia = this.alumno.referencia || "Sin datos";
    this.alumno.domicilio_actual = this.alumno.domicilio_actual || "Sin datos";


    if (this.nivelSeleccionado && this.gradoSeleccionado) {
      this.alumno.nivel = this.nivelSeleccionado.id_nivelacademico || 0;
      this.alumno.grado = this.gradoSeleccionado.id_grdacademico || 0;

      if (!this.alumno.nombres) {
        this.obtenerDatosReniec(this.alumno.dni).then(datosReniec => {
          if (datosReniec) {
            this.alumno.nombres = datosReniec.nombres;
            this.alumno.apellidos = `${datosReniec.apellido_paterno} ${datosReniec.apellido_materno}`.trim();
          }
          this.enviarAlumno();
        }).catch(() => {
          Swal.fire('Error', 'No se pudo obtener los datos del DNI.', 'error');
        });
      } else {
        this.enviarAlumno();
      }
    }
  }

  obtenerDatosReniec(dni: string): Promise<any> {
    return fetch(`https://apiperu.dev/api/dni/${dni}`, {
      headers: {
        "Authorization": "Bearer c055fe0158207e8ded0d5ebd1c6379b6c718dc147c40fc39e425b333557f0dea"
      }
    })
    .then(response => response.json())
    .then(data => data.data)
    .catch(error => {
      console.error('Error obteniendo datos de RENIEC:', error);
      return null;
    });
  }

  enviarAlumno(): void {
    this.alumnoService.addAlumno(this.alumno).subscribe({
      next: (response) => {
        Swal.fire('Éxito', response.message || 'Alumno guardado exitosamente.', 'success');
        this.alumnoGuardadoEvent.emit(response.data);
        this.cerrarModal();
      },
      error: (error) => {
        console.error("Error en la solicitud:", error);
        Swal.fire('Error', error.details || 'Ya existe un alumno con el mismo dni.', 'warning');
      }
    });
  }

  validarMayorDeEdad(fechaNacimiento: string): boolean {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    return hoy.getFullYear() - fechaNac.getFullYear() < 18;
  }

}
