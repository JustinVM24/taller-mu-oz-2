import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar,
  IonButton, IonIcon, IonBadge
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, download, add, trash, pencil, trendingUp, calendar, people } from 'ionicons/icons';
import { DbService } from '../../core/services/db.service';
import { Servicio } from '../../core/models/servicio.model';
import { Empleado } from '../../core/models/empleado.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonBadge
  ]
})
export class AdminPage implements OnInit {
  tabActiva = 'resumen';

  vehiculosHoy = 0;
  serviciosHoy = 0;
  servicioMasComun = '';
  empleadoDestacado = '';

  categorias: string[] = [
    'Cambio de aceite',
    'Revision de frenos',
    'Alineacion y balanceo',
    'Cambio de llantas',
    'Revision general',
    'Cambio de filtros',
    'Reparacion de motor',
    'Reparacion de transmision'
  ];

  empleados: Empleado[] = [
    { id: 1, nombre: 'Juan Perez', email: 'juan@tallermunoz.com', rol: 'empleado', activo: true },
    { id: 2, nombre: 'Maria Gonzalez', email: 'maria@tallermunoz.com', rol: 'empleado', activo: true },
    { id: 3, nombre: 'Pedro Sanchez', email: 'pedro@tallermunoz.com', rol: 'empleado', activo: false }
  ];

  nuevaCategoria = '';
  mostrarInputCategoria = false;

  constructor(private router: Router, private db: DbService) {
    addIcons({ arrowBack, download, add, trash, pencil, trendingUp, calendar, people });
  }

  async ngOnInit() {
    await this.db.init();
    await this.calcularResumen();
  }

  async calcularResumen() {
    const servicios = await this.db.obtenerServicios();
    const hoy = new Date().toDateString();
    const serviciosDeHoy = servicios.filter(s => new Date(s.fecha).toDateString() === hoy);
    this.serviciosHoy = serviciosDeHoy.length;

    const vehiculosHoy = new Set(serviciosDeHoy.map(s => s.vehiculoId));
    this.vehiculosHoy = vehiculosHoy.size;

    if (servicios.length > 0) {
      const conteo: { [key: string]: number } = {};
      servicios.forEach(s => { conteo[s.descripcion] = (conteo[s.descripcion] || 0) + 1; });
      this.servicioMasComun = Object.keys(conteo).reduce((a, b) => conteo[a] > conteo[b] ? a : b);
    }

    this.empleadoDestacado = 'Juan Perez';
  }

  cambiarTab(tab: string) {
    this.tabActiva = tab;
  }

  agregarCategoria() {
    if (this.nuevaCategoria.trim()) {
      this.categorias.push(this.nuevaCategoria.trim());
      this.nuevaCategoria = '';
      this.mostrarInputCategoria = false;
    }
  }

  eliminarCategoria(i: number) {
    this.categorias.splice(i, 1);
  }

  toggleEmpleado(emp: Empleado) {
    emp.activo = !emp.activo;
  }

  async exportarDatos() {
    const servicios = await this.db.obtenerServicios();
    const vehiculos = await this.db.obtenerVehiculos();
    const datos = servicios.map(s => {
      const v = vehiculos.find(v => v.id === s.vehiculoId);
      return {
        Placa: v?.placa || '',
        Propietario: v?.propietario || '',
        Servicio: s.descripcion,
        Notas: s.notas || '',
        Empleado: s.empleadoNombre || '',
        Fecha: s.fecha,
        Estado: s.sincronizado
      };
    });
    const csv = [
      Object.keys(datos[0] || {}).join(','),
      ...datos.map(row => Object.values(row).join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taller-munoz-historial.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

  volver() {
    this.router.navigate(['/buscar-placa']);
  }
}