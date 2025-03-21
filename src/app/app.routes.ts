import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './components/error/error.component';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./home/components.routes').then(m => m.DASHBOARD_ROUTES)
  },
  { path: '**', redirectTo: '404' },
  { path: '404', component: ErrorComponent }
];
