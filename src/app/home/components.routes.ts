import { components } from "./components";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { Routes } from "@angular/router";
import { ComponentsComponent } from "./components.component";
import { ConceptoDePagoComponent } from "../pages/admin_finanzas/concepto-de-pago/concepto-de-pago.component";
import { PagosComponent } from "../pages/admin_finanzas/pagos/pagos.component";
import { VoucherPagoComponent } from "../pages/admin_finanzas/voucher-pago/voucher-pago.component";
import { GradoAcademicoComponent } from "../pages/admin_academica/grado-academico/grado-academico.component";
import { NivelEducativoComponent } from "../pages/admin_academica/nivel-educativo/nivel-educativo.component";
import { EstudiantesComponent } from "../pages/admin_personal/estudiantes/estudiantes.component";
import { PadresComponent } from "../pages/admin_personal/padres/padres.component";
import { MatriculasComponent } from "../pages/matriculas/matriculas.component";
import { PensionesComponent } from "../pages/pensiones/pensiones.component";
import { ReportesComponent } from "../pages/reportes/reportes.component";
import { ConfiguracionesComponent } from "../pages/configuraciones/configuraciones.component";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: [
      {path: '', component: DashboardComponent},
      {path: 'concepto-de-pago', component: ConceptoDePagoComponent},
      {path: 'pagos', component: PagosComponent},
      {path: 'voucher-pago', component: VoucherPagoComponent},
      {path: 'grado-academico', component: GradoAcademicoComponent},
      {path: 'nivel-educativo', component: NivelEducativoComponent},
      {path: 'estudiantes', component: EstudiantesComponent},
      {path: 'padres', component: PadresComponent},
      {
        path: 'matriculas',
        loadChildren: () => import('../pages/matriculas/matriculas.routes').then(m => m.MATRICULA_ROUTES)
      },
      {path: 'pensiones', component: PensionesComponent},
      {path: 'reportes', component: ReportesComponent},
      {path: 'configuraciones', component: ConfiguracionesComponent},
    ]
  }
 ]
