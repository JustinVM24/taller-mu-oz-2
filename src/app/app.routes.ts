import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { OwnerGuard } from './core/guards/owner.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'buscar-placa',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/buscar-placa/buscar-placa.page').then((m) => m.BuscarPlacaPage),
  },
  {
    path: 'vehiculo/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/vehiculo/vehiculo.page').then((m) => m.VehiculoPage),
  },
  {
    path: 'nuevo-servicio/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/nuevo-servicio/nuevo-servicio.page').then((m) => m.NuevoServicioPage),
  },
  {
    path: 'nuevo-vehiculo',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/nuevo-vehiculo/nuevo-vehiculo.page').then((m) => m.NuevoVehiculoPage),
  },
  {
    path: 'historial',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./pages/historial/historial.page').then((m) => m.HistorialPage),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, OwnerGuard],
    loadComponent: () =>
      import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
];