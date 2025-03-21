import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { FooterComponent } from '../components/footer/footer.component';
import { components } from './components';
import { SidebarService } from '../core/services/sidebar.service';

@Component({
  selector: 'app-components',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './components.component.html',
  styleUrls: [ './components.component.css']
})
export class ComponentsComponent implements OnInit, OnDestroy{
  components = components;
  resizeObserver: ResizeObserver | null = null;

  constructor(readonly sidebarService: SidebarService) {}

  ngOnInit(): void {
    initFlowbite();
    console.log(components);

    this.resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentRect.width < 768) {
          this.sidebarService.setAutoCollapse(true);
        } else {
          this.sidebarService.setAutoCollapse(false);
        }
      }
    });

    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}
