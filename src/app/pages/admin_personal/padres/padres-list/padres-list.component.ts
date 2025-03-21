import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { Padre } from '../../../../core/models/padre.model';
import { PadreEditComponent } from '../padre-edit/padre-edit.component';
import { PadreService } from '../../../../core/services/padre.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../../shared/pipes/filter.pipe';
import { ToastrService } from 'ngx-toastr';
import { EncabezadoDinamicoDirective } from '../../../../shared/directives/encabezado-dinamico.directive';
import { PadreAddComponent } from '../padre-add/padre-add.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-padres-list',
    standalone: true,
    templateUrl: './padres-list.component.html',
    styleUrls: ['./padres-list.component.css'],
    imports: [CommonModule, FormsModule, FilterPipe, PadreEditComponent, EncabezadoDinamicoDirective, PadreAddComponent],
})
export class PadresListComponent implements OnInit, OnChanges {
  @Input() enableSelection: boolean = false;
  padres: Padre[] = [];
  padre: Padre | null = null;
  @Output() addPadre = new EventEmitter<void>();
  @Output() padreSeleccionadoEvent = new EventEmitter<Padre>();
  @Output() editPadre = new EventEmitter<Padre>();
  @Output() padreGuardadoEvent = new EventEmitter<Padre>();

  searchText: string = '';
  selectedPadre: Padre | null = null;
  padreSeleccionado: any = null;

  @ViewChild(PadreAddComponent) modalAdd!: PadreAddComponent;
  @ViewChild(PadreEditComponent) modalEdit!: PadreEditComponent;

  encabezados: string[] = [
    'N°', 'Código', 'Apellidos y Nombres', 'Parentesco', 'DNI', 'Ocupación', 'Centro de Trabajo',
    'Dirección', 'Teléfono Celular', 'Estado Civil', 'Fecha de Nacimiento', 'Acciones'
  ];

  constructor(private padreService: PadreService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPadres();
  }

  onPadreSeleccionado(padre: any) {
    this.padreSeleccionado = padre;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['padres']) {
      this.loadPadres();
    }
  }

  loadPadres(): void {
    this.padreService.allPadres().subscribe(
      data => {
        this.padres = data;
      },
      error => {
        this.toastr.error( error.details || 'Error al cargar los padres');
        console.error('Error al cargar los padres:', error);
      }
    );
  }

  abrirPanelDelete(padre: any) {
    Swal.fire({
      title: `¿Eliminar ${padre.apellidos_nombres}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        if (padre.id_padre !== undefined) { // Usar padre.id_padre directamente
          this.padreService.deletePadre(padre.id_padre).subscribe(
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

  abrirModalEdit(padre: Padre) {
    this.selectedPadre = { ...padre };
    this.modalEdit.padre = this.selectedPadre;
    this.modalEdit.abrirModal();
  }

  recargar() {
    this.loadPadres();
  }

  abrirModalAdd(): void {
    this.modalAdd.abrirModalAdd();
  }

  onPadreGuardado(padre: Padre): void {
    this.padres.push(padre);
    this.padreGuardadoEvent.emit(padre);
    this.recargar();
  }

  onAddPadre() {
    this.addPadre.emit();
  }

  onSelectPadre(padre: Padre, event: Event): void {
    this.padreSeleccionadoEvent.emit(padre);
  }

  selectPadre(padre: Padre): void {
    this.padreSeleccionadoEvent.emit(padre);
  }

  onEditPadre(padre: Padre): void {
    this.editPadre.emit(padre);
  }

}
