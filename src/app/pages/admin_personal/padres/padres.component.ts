import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PadresListComponent } from './padres-list/padres-list.component';
import { Padre } from '../../../core/models/padre.model';

@Component({
  selector: 'app-padres',
  standalone: true,
  imports: [CommonModule, FormsModule, PadresListComponent],
  templateUrl: './padres.component.html',
  styleUrl: './padres.component.css',

})
export class PadresComponent {
  padres: Padre[] = [];
  @ViewChild(PadresListComponent) padresList!: PadresListComponent;

}
