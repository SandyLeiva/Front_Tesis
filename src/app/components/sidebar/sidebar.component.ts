import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SidebarService } from '../../core/services/sidebar.service';
import { SidebarItemComponent } from './sidebar-item/sidebar-item.component';
import { SidebarItemGroupComponent } from './sidebar-item-group/sidebar-item-group.component';
import { RouteProps, SubRouteProps } from '../../home/components';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarItemComponent, SidebarItemGroupComponent],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() extraClass = '';
  @Input() rounded = false;
  @Input() routes: RouteProps[] = [];
  openGroups: Set<string> = new Set();

  constructor(readonly sidebarService: SidebarService) {}

  toggleGroup(title: string) {
    if (this.openGroups.has(title)) {
      this.openGroups.delete(title);
    } else {
      this.openGroups.add(title);
    }
  }

  isGroupOpen(title: string): boolean {
    return this.openGroups.has(title);
  }

  getSubRoutes(route: RouteProps): SubRouteProps[] {
    return route.subRoutes || [];
  }
  
}
