import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, inject } from '@angular/core';
import { NivelAcademico } from '../../../core/models/nivel-academico.model';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { NivelEducativoService } from '../../../core/services/nivel-educativo.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-nivel-educativo',
  standalone: true,
  imports: [CommonModule,
    FormsModule, FilterPipe],
  templateUrl: './nivel-educativo.component.html',
  styleUrl: './nivel-educativo.component.css',
})

export class NivelEducativoComponent implements OnInit {
  niveles: NivelAcademico[] = [];
  searchText: string = '';

  selectedNivel: NivelAcademico | null = null;

  isPanelOpen = false;
  isEditing = false;
  nivel: NivelAcademico = { id_nivelacademico: 0, nombre: '' };
  nivelEditIndex: number | null = null;

  constructor(private nivelEducativoService: NivelEducativoService) {}
  private toastr = inject(ToastrService);

  abrirPanelAdd() {
    this.nivel = { id_nivelacademico: 0, nombre: '' }; // Aseguramos que nombre siempre tenga un valor
    this.isEditing = false;
    this.isPanelOpen = true;
  }

  abrirPanelEdit(nivel: any) {
    this.nivel = { ...nivel };
    this.isEditing = true;
    this.isPanelOpen = true;
  }

  abrirPanelDelete(nivel: any) {
    Swal.fire({
      title: `¿Eliminar ${nivel.nombre}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.nivelEducativoService.deleteNivel(nivel.id_nivelacademico).subscribe(
          () => {
                 Swal.fire('Eliminado', 'Nivel educativo eliminado correctamente.', 'success');
                 this.recargar();

      },
      (error) => {
        Swal.fire('Error', error.details || 'No se pudo eliminar el nivel educativo.', 'error');
        console.error('Error al eliminar nivel:', error);
      }
        );
      }
    });
  }

  ngOnInit(): void {
    this.allNiveles();
    this.loadNiveles();
  }


  recargar(): void {
    this.allNiveles();
  }

  allNiveles(): void {
    this.nivelEducativoService.allNiveles().subscribe(
      (data) => {
        this.niveles = data;
      },
      (error) => {
        Swal.fire('Error',error.details ||  'No se pudieron cargar los niveles educativos.', 'error');
        console.error('Error al obtener niveles:', error);
      }
    );
  }

  loadNiveles() {
    this.nivelEducativoService.allNiveles().subscribe(
      data => {
        this.niveles = data;
      },
      error => {
        this.toastr.error(error.details || 'Error al cargar los niveles');
        console.error('Error al cargar los niveles:', error);
      }
    );
  }

  onNivelGuardado() {
    this.allNiveles();
    this.loadNiveles();
  }

  guardarNivel() {
    if (this.nivel.nombre.trim() === '') {
      Swal.fire('Error', 'El nombre del nivel académico no puede estar vacío.', 'error');
      return;
    }

    const nombreExiste = this.niveles.some(n => n.nombre.toLowerCase() === this.nivel.nombre.toLowerCase() && n.id_nivelacademico !== this.nivel.id_nivelacademico);
    if (nombreExiste) {
      Swal.fire('Error', 'El nombre del nivel académico ya existe.', 'warning');
      return;
    }

    if (this.isEditing) {
      // Actualizar nivel
      this.nivelEducativoService.updateNivel(this.nivel).subscribe(
        () => {
          Swal.fire('Actualizado', 'Nivel educativo actualizado correctamente.', 'success');
          this.recargar();
          this.cerrarPanel();
        },
        (error) => {
          this.toastr.error( error.details || 'Error al actualizar el nivel educativo');
          console.error('Error al actualizar el nivel:', error);
        }
      );
    } else {
      // Verificar si el nivel ya existe antes de agregarlo
      this.nivelEducativoService.checkNivelExists(this.nivel.nombre).subscribe(
        (exists) => {
          if (exists) {
            this.toastr.error('El nombre del nivel académico ya existe');
          } else {
            this.nivelEducativoService.addNivel(this.nivel).subscribe(
              () => {
                Swal.fire('Guardado', 'Nivel educativo añadido correctamente.', 'success');
                this.allNiveles();
                this.cerrarPanel();
              },
              (error) => {
                this.toastr.error( error.details || 'Error al guardar el nivel educativo');
                console.error('Error al guardar el nivel:', error);
              }
            );
          }
        },
        (error) => {
          console.error( error.details || 'Error verificando existencia de nivel:', error);
        }
      );
    }
  }

  cerrarPanel() {
    this.isPanelOpen = false;
  }


}
