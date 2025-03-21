import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { GradoAcademico } from '../../../core/models/grado-academico.model';
import { GradoAcademicoService } from '../../../core/services/grado-academico.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import Swal, { SweetAlertPosition } from 'sweetalert2';
import { NivelAcademico } from '../../../core/models/nivel-academico.model';
import { NivelEducativoService } from '../../../core/services/nivel-educativo.service';

@Component({
  selector: 'app-grado-academico',
  standalone: true,
  imports: [CommonModule,
    FormsModule, FilterPipe],
  templateUrl: './grado-academico.component.html',
  styleUrl: './grado-academico.component.css'
})
export class GradoAcademicoComponent implements OnInit {

  @Output() gradoGuardadoEvent = new EventEmitter<void>();
  @Output() actualizarGradoEvent = new EventEmitter<void>();

  grados: GradoAcademico[] = [];
  niveles: NivelAcademico[] = [];
  nivelSeleccionado: NivelAcademico | null = null;

  searchText: string = '';
  descripcion: string = '';
  selectedGrado: GradoAcademico | null = null;

  isPanelOpen = false;
  isEditing = false;

  grado: GradoAcademico = {
    id_grdacademico: 0,
    descripcion: '',
    nivel_nombre: '',
    id_nivel: 0
  };

  gradoEditIndex: number | null = null;

  constructor(
      private nivelEducativoService: NivelEducativoService,
      private gradoEducativoService: GradoAcademicoService,
      private toastr: ToastrService
    ) {}

    showMessage(color: "success" | "danger" | "warning" | "info" , msg = '', position :SweetAlertPosition = 'top-right', showCloseButton = true, closeButtonHtml = '', duration = 3000){
      const toast = Swal.mixin({
        color: '',
          toast: true,
          position: position || 'top-right',
          showConfirmButton: false,
          timer: duration,
          customClass: {
            popup: `color-${color}`
        },
          showCloseButton: showCloseButton,
      });
      toast.fire({
          title: msg

      });
    };

    abrirPanelAdd() {
      this.grado = { id_grdacademico: 0, descripcion: '', nivel_nombre: '', id_nivel: this.niveles.length > 0 ? this.niveles[0].id_nivelacademico : 0 };
      this.isEditing = false;
      this.isPanelOpen = true;
    }

    abrirPanelEdit(grado: any) {
      this.grado = { ...grado };
      this.isEditing = true;
      this.isPanelOpen = true;
    }

    abrirPanelDelete(grado: any) {
      Swal.fire({
            title: `¿Eliminar ${grado.descripcion}?`,
            text: 'Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
              if (result.isConfirmed) {
                this.gradoEducativoService.deleteGrado(grado.id_grdacademico).subscribe(
                  () => {
                        this.showMessage('success', 'Grado académico eliminado correctamente.');

                        this.recargar();
                      },
                (error) => {
                  Swal.fire('Error',  error.details ||'No se pudo eliminar el grado academico.', 'error');
                  console.error('Error al eliminar grado:', error);
                }
                  );
                }
              });
            }

  ngOnInit(): void {
    this.cargarNiveles();
    this.allGrados();
  }


  allGrados(): void {
    this.gradoEducativoService.allGrados().subscribe(
      (data) => {
        this.grados = data;
      },
      (error) => {
        Swal.fire('Error', error.details || 'No se pudieron cargar los grados academicos.', 'error');
        console.error('Error:', error);
      }
    );
  }

  recargar(): void {
    this.allGrados();
  }

  cargarNiveles(): void {
    this.nivelEducativoService.allNiveles().subscribe(
      niveles => {
      this.niveles = niveles;
      if (!this.isEditing && this.niveles.length > 0 && !this.grado.id_nivel) {
        this.grado.id_nivel = this.niveles[0].id_nivelacademico;
      }
    },
    error => {
      this.toastr.error( error.details || ' Error al cargar los niveles');
      console.error('Error al cargar los niveles:', error);
    }
  );
  }

  cargarDatos(): void {
    if (this.grado !== null && this.grado !== undefined) {
      this.descripcion = this.grado.descripcion;
      this.nivelSeleccionado = this.niveles.find(nivel => nivel.id_nivelacademico === this.grado?.id_nivel) || null;
    }
  }

  onGradoGuardado() {
    this.allGrados();
  }

  guardarGrado(): void {
      if (this.isEditing) {
        this.actualizarGrado();
      } else {
        this.guardarNuevoGrado();
      }
    }

  actualizarGrado(): void {
    this.gradoEducativoService.updateGrado(this.grado).subscribe(
      () => {
        Swal.fire('Actualizado', 'Nivel educativo actualizado correctamente.', 'success');
        this.recargar();
        this.cerrarPanel();
      },
      (error) => {
        console.error("Error en la solicitud:", error);

        let mensajeError = 'Error interno.';
          if (error.error && error.error.details) {
            const errores = Object.keys(error.error.details)
              .map(key => `${error.error.details[key].join(', ')}`)
              .join('<br>');

            mensajeError = errores || error.error.error || mensajeError;
        }
      Swal.fire('Error', mensajeError, 'warning');
}
    );
  }

      guardarNuevoGrado() {
        this.gradoEducativoService.addGrado(this.grado).subscribe(
          () => {
            Swal.fire({
              title: 'Guardado',
              text: 'Grado académico añadido correctamente.',
              icon: 'success',
              timer: 2000
            });
            this.recargar();
            this.cerrarPanel();
          },
          (error) => {
                  console.error("Error en la solicitud:", error);

              let mensajeError = 'Error interno.';
                if (error.error && error.error.details) {
                  const errores = Object.keys(error.error.details)
                    .map(key => `${error.error.details[key].join(', ')}`)
                    .join('<br>');

                  mensajeError = errores || error.error.error || mensajeError;
              }
            Swal.fire('Error', mensajeError, 'warning');
          }
        );
      }

        actualizarNivelSeleccionado(event: Event) {
          const selectElement = event.target as HTMLSelectElement;
          console.log(selectElement.value); // Ahora accedemos correctamente al valor seleccionado
        }

        cerrarPanel() {
        this.isPanelOpen = false;
      }
}
