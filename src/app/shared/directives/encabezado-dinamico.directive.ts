import { Directive, Input, OnInit, ElementRef } from '@angular/core';

@Directive({
  selector: '[appEncabezadoDinamico]',
  standalone: true
})
export class EncabezadoDinamicoDirective implements OnInit {
  @Input() appEncabezadoDinamico: string[] = [];

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.actualizarEncabezados();
  }
  private actualizarEncabezados() {
    const thead = this.el.nativeElement;
    const tr = document.createElement('tr');

    this.appEncabezadoDinamico.forEach(encabezado => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.className = 'p-4 text-xs font-bold text-center text-black-500 uppercase';
      th.innerText = encabezado;
      tr.appendChild(th);
    });

    thead.appendChild(tr);
  }
}
