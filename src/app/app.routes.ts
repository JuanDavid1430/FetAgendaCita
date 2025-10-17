import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ServiciosListaComponent } from './components/servicios-lista/servicios-lista.component';
import { ReservaFormComponent } from './components/reserva-form/reserva-form.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { ReservasComponent } from './components/admin/reservas/reservas.component';
import { ServiciosComponent } from './components/admin/servicios/servicios.component';
import { ConfiguracionComponent } from './components/admin/configuracion/configuracion.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Rutas públicas
  { path: '', component: HomeComponent },
  { path: 'servicios', component: ServiciosListaComponent },
  { path: 'reservar', component: ReservaFormComponent },
  
  // Ruta de login (sin protección)
  { path: 'admin/login', component: AdminLoginComponent },
  
  // Rutas protegidas de admin
  { 
    path: 'admin/dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin/reservas', 
    component: ReservasComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin/servicios', 
    component: ServiciosComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin/configuracion/horarios', 
    component: ConfiguracionComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin/configuracion/dias-bloqueados', 
    component: ConfiguracionComponent,
    canActivate: [authGuard]
  },
  
  // Ruta por defecto
  { path: '**', redirectTo: '' }
];
