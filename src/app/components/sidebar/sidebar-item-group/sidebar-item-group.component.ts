import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-sidebar-item-group',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-item-group.component.html',
  styleUrl: './sidebar-item-group.component.css'
})
export class SidebarItemGroupComponent {
  @Input() isOpen: boolean = false;
  toggleOpen() {
    this.isOpen = !this.isOpen;
  }
}
