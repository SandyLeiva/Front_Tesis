import { Padre } from './../../../../core/models/padre.model';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PadreService } from '../../../../core/services/padre.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-padre-add',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './padre-add.component.html',
  styleUrl: './padre-add.component.css',
})
export class PadreAddComponent {
  @Output() cerrarModalEvent = new EventEmitter<void>();
  @Output() padreGuardadoEvent = new EventEmitter<Padre>(); // Emit Padre object
  isOpen = false;

  padres:Padre[] = [];

  padre: Padre = {
    codigo: '',
    apellidos_nombres: '',
    parentesco: '',
    dni: '',
    ocupacion: '',
    centro_trabajo: '',
    direccion: '',
    telefono_celular: '',
    estado_civil: '',
    fecha_nacimiento: ''
  };

  fechaMaximaPermitida: string = '';

  constructor(private padreService: PadreService) {
    this.calcularFechaMaxima();
  }

  calcularFechaMaxima() {
    const hoy = new Date();
    hoy.setFullYear(hoy.getFullYear() - 18); // Restar 18 años
    this.fechaMaximaPermitida = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  abrirModalAdd() {
    this.isOpen = true;
  }

  cerrarModal() {
    this.limpiarFormulario(); // Llama a la función para limpiar campos
    this.isOpen = false;
    this.cerrarModalEvent.emit();
  }

  limpiarFormulario() {
    this.padre = {
      codigo: '',
      apellidos_nombres: '',
      parentesco: '',
      dni: '',
      ocupacion: '',
      centro_trabajo: '',
      direccion: '',
      telefono_celular: '',
      estado_civil: '',
      fecha_nacimiento: ''
    };
  }

  guardarPadre() {

    console.log("Datos enviados:", this.padre);

    // Validar que sea mayor de 18 años
    if (!this.validarMayorDeEdad(this.padre.fecha_nacimiento)) {
      Swal.fire('Error', 'El padre debe ser mayor de 18 años.', 'error');
      return;
    }

    this.padre.ocupacion = this.padre.ocupacion || "Sin datos";
    this.padre.centro_trabajo = this.padre.centro_trabajo || "Sin datos";
    this.padre.estado_civil = this.padre.estado_civil || "Sin datos";
    this.padre.direccion = this.padre.direccion || "Sin datos";
    this.padre.telefono_celular = this.padre.telefono_celular || "Sin datos";

    // Obtener datos desde RENIEC si los nombres no están ingresados
    if (!this.padre.apellidos_nombres) {
      this.obtenerDatosReniec(this.padre.dni).then(datosReniec => {
        if (datosReniec) {
          this.padre.apellidos_nombres = `${datosReniec.apellido_paterno} ${datosReniec.apellido_materno} ${datosReniec.nombres}`.trim();
        }
        this.enviarPadre();
      }).catch((error) => {
        Swal.fire('Error',  error.details || 'No se pudo obtener los datos del DNI.', 'error');
      });
    } else {
      this.enviarPadre();
    }
  }

  // Método para obtener datos desde la API de RENIEC
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

  enviarPadre() {
    this.padreService.addPadre(this.padre).subscribe({
      next: (response) => {
          this.padre.codigo = response.data.codigo;
          Swal.fire('Éxito', response.message || 'Padre guardado exitosamente.', 'success');
          this.padreGuardadoEvent.emit(response.data);
          this.cerrarModal();
      },
      error: (error) => {
        console.error("Error en la solicitud:", error);

        let mensajeError = 'Error interno.';

        // Verifica si el error tiene detalles específicos
        if (error.error && error.error.details) {
          const errores = Object.keys(error.error.details)
            .map(key => `${error.error.details[key].join(', ')}`)
            .join('<br>'); // Formatear los errores en varias líneas si hay más de uno

          mensajeError = errores || error.error.error || mensajeError;
        }

        Swal.fire('Error', mensajeError, 'warning');
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
