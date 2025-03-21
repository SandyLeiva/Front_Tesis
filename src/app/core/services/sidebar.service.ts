import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RouteProps, components } from '../../home/components';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  $collapsed = new BehaviorSubject<boolean>(false);
  routes = new BehaviorSubject<RouteProps[]>(components);
  $autoCollapse = new BehaviorSubject<boolean>(false);

  constructor() {
    window.addEventListener('resize', () => {
      this.checkAutoCollapse();
    });
  }

  setCollapsed(collapsed: boolean) {
    this.$collapsed.next(collapsed);
  }

  setAutoCollapse(value: boolean) {
    this.$autoCollapse.next(value);
  }

  toggleCollapsed() {
    const currentCollapsed = this.$collapsed.getValue();
    this.$collapsed.next(!currentCollapsed);
  }

  private checkAutoCollapse() {
    const autoCollapseEnabled = this.$autoCollapse.getValue();
    const currentCollapsed = this.$collapsed.getValue();

    if (autoCollapseEnabled && window.innerWidth < 768) {
      if (!currentCollapsed) {
        this.setCollapsed(true);
      }
    }
  }
}
