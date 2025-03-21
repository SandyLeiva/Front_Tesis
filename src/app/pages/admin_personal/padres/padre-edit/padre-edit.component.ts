import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PadreService } from '../../../../core/services/padre.service';
import { Padre } from '../../../../core/models/padre.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-padre-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './padre-edit.component.html',
  styleUrls: ['./padre-edit.component.css']
})
export class PadreEditComponent {

  @Input() padre: Padre | null = null;
  @Output() cerrarModalEvent = new EventEmitter<void>();
  @Output() actualizarPadreEvent = new EventEmitter<void>();

  isOpen = false;
  fechaMaximaPermitida: string = '';

  constructor(
    private padreService: PadreService,
  ) {}

  calcularFechaMaxima() {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18); // Restar 18 años
    this.fechaMaximaPermitida = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  abrirModal() {
    this.isOpen = true;
  }

  cerrarModal() {
    this.isOpen = false;
    this.cerrarModalEvent.emit();
  }

  updatePadre(event: Event, field: keyof Padre) {
    const input = event.target as HTMLInputElement;
    if (this.padre) {
      (this.padre[field] as unknown as string) = input.value;
    }
  }

  actualizarPadre() {
    if (this.padre) {

      if (!this.padre.dni || this.padre.dni.length !== 8) {
        Swal.fire('Error', 'El DNI debe tener 8 dígitos.', 'warning');
        return;
      }
      if (!this.padre.telefono_celular || this.padre.telefono_celular.length !== 9) {
        Swal.fire('Error', 'El teléfono celular debe tener 9 dígitos.', 'warning');
        return;
      }
      if (!this.padre.parentesco) {
        Swal.fire('Advertencia', 'El parentesco es obligatorio.', 'warning');
        return;
      }
      if (!this.padre.telefono_celular) {
            Swal.fire('Advertencia', 'El teléfono celular es obligatorio.', 'warning');
            return;
          }
      if (!this.padre.direccion) {
        Swal.fire('Advertencia', 'La dirección es obligatoria.', 'warning');
        return;
      }
      if (!this.padre.fecha_nacimiento) {
        Swal.fire('Advertencia', 'La fecha de nacimiento es obligatoria.', 'warning');
        return;
      }
      if (!this.validarMayorDeEdad(this.padre.fecha_nacimiento)) {
        Swal.fire('Error', 'El padre debe ser mayor de 18 años.', 'error');
        return;
      }

      this.padre.ocupacion = this.padre.ocupacion || "Sin datos";
      this.padre.centro_trabajo = this.padre.centro_trabajo || "Sin datos";
      this.padre.estado_civil = this.padre.estado_civil || "Sin datos";


      this.enviarActualizacionPadre();

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

  enviarActualizacionPadre() {
    if (!this.padre) return;

    this.padreService.updatePadre(this.padre).subscribe({

      next: (response) => {

        if (response.message === 'El registro se ha actualizado correctamente') {
          Swal.fire('Éxito', 'Padre actualizado exitosamente.', 'success');
          this.cerrarModal();
          this.actualizarPadreEvent.emit();
        } else {
          Swal.fire('Error', 'No se pudo actualizar al padre.', 'error');
        }
        },
        error: (err) => {
          if (err.error && err.error.dni) {
          Swal.fire('Error', err.error.dni[0], 'error'); // Captura el error específico del backend
        } else {
          Swal.fire('Error', 'Ocurrió un error al actualizar al padre.', 'error');
        }
      }
    });
  }

    validarMayorDeEdad(fechaNacimiento: string): boolean {
      const fechaNac = new Date(fechaNacimiento);
      const hoy = new Date();

      // Calcular la edad
      let edad = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
      }

      return edad >= 18;
    }
  }
