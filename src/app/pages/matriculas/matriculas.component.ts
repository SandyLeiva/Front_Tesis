import { Component } from '@angular/core';
import { MatriculasAddComponent } from './matriculas-add/matriculas-add.component';
import { RouterModule } from '@angular/router';
import { FilterPipe } from '../../shared/pipes/filter.pipe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [MatriculasAddComponent, RouterModule, FilterPipe, CommonModule, FormsModule],
  templateUrl: './matriculas.component.html',
  styleUrl: './matriculas.component.css'
})
export class MatriculasComponent {
  searchTerm: string = '';
}
