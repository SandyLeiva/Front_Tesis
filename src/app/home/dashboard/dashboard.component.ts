import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import * as echarts from 'echarts/core';
import { GridComponent } from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart, LineSeriesOption } from 'echarts/charts';

echarts.use([GridComponent, BarChart, LineChart, UniversalTransition, CanvasRenderer]);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  private chartPensiones: echarts.ECharts | null = null;
  private chartDeudores: echarts.ECharts | null = null;

  nombreMesArray: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'];
  pensionesPagadasArray: number[] = [15000, 18000, 17000, 20000, 22000, 19000];
  cantidadDeudoresArray: number[] = [10, 15, 12, 8, 20, 18];

  constructor() {}

  ngAfterViewInit(): void {
    this.initCharts();
    window.addEventListener('resize', this.resizeCharts);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeCharts);
    this.disposeCharts();
  }

private initCharts(): void {
    const chartDom1 = document.getElementById('main');
    const chartDom2 = document.getElementById('chart2');

    if (chartDom1) {
      this.chartPensiones = echarts.init(chartDom1);
      this.chartPensiones.setOption({
        title: { text: 'Pensiones Pagadas por Mes', left: 'center' },
        xAxis: { type: 'category', data: this.nombreMesArray },
        yAxis: { type: 'value', name: 'Soles (S/)' },
        series: [{
          data: this.pensionesPagadasArray,
          type: 'line',
          label: { show: true, position: 'top', color: '#333', fontSize: 12 },
          itemStyle: { color: '#5470c6' },
          lineStyle: { width: 2 }
        }],
        grid: { left: '10%', right: '10%', bottom: '10%', containLabel: true }
      });

      setTimeout(() => {
        if (this.chartPensiones) this.chartPensiones.resize();
      }, 200);
    }

    if (chartDom2) {
      this.chartDeudores = echarts.init(chartDom2);
      this.chartDeudores.setOption({
        title: { text: 'Cantidad de Deudores por Mes', left: 'center' },
        xAxis: { type: 'category', data: this.nombreMesArray },
        yAxis: { type: 'value', name: 'Deudores' },
        series: [{
          data: this.cantidadDeudoresArray,
          type: 'bar',
          label: { show: true, position: 'top', color: '#333', fontSize: 12 },
          itemStyle: { color: '#d9534f' }
        }],
        grid: { left: '10%', right: '10%', bottom: '10%', containLabel: true }
      });

      setTimeout(() => {
        if (this.chartDeudores) this.chartDeudores.resize();
      }, 200);
    }
  }

  private resizeCharts = () => {
    if (this.chartPensiones) this.chartPensiones.resize();
    if (this.chartDeudores) this.chartDeudores.resize();
  };

  private disposeCharts(): void {
    if (this.chartPensiones) {
      this.chartPensiones.dispose();
      this.chartPensiones = null;
    }
    if (this.chartDeudores) {
      this.chartDeudores.dispose();
      this.chartDeudores = null;
    }
  }
}
