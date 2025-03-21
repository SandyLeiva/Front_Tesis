import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { Matricula } from '../../../core/models/matricula.model';
import { MatriculaService } from '../../../core/services/matricula.service';
import { ToastrService } from 'ngx-toastr';
import { EncabezadoDinamicoDirective } from '../../../shared/directives/encabezado-dinamico.directive';

@Component({
  selector: 'app-matriculas-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe, EncabezadoDinamicoDirective],
  templateUrl: './matriculas-list.component.html',
  styleUrl: './matriculas-list.component.css'
})
export class MatriculasListComponent implements OnInit{
  searchText: string = '';
  matriculas: Matricula[] = [];
  selectedAlumno: Matricula | null = null;

  encabezados: string[] = [
    'ID', 'Código', 'Fecha de Matricula', 'Periodo', 'Concepto de Pago', 'Padre', 'Acciones'
  ];

  constructor(private matriculaService: MatriculaService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadMatriculas();
  }

  loadMatriculas(): void {
    this.matriculaService.allMatriculas().subscribe(
      data => {
        this.matriculas = data;
      },
      error => {
        this.toastr.error('Error al cargar las matriculas');
        console.error('Error al cargar las matriculas:', error);
      }
    );
  }

  recargar() {
    this.loadMatriculas();
  }
}
