import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar,
  IonButton, IonIcon, IonSearchbar, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, add, settings, checkmarkCircle, time, warning } from 'ionicons/icons';
import { DbService } from '../../core/services/db.service';
import { Vehiculo } from '../../core/models/vehiculo.model';
import { Servicio } from '../../core/models/servicio.model';

@Component({
  selector: 'app-vehiculo',
  templateUrl: './vehiculo.page.html',
  styleUrls: ['./vehiculo.page.scss'],
  standalone: true,
  imports: [IonBadge, 
    CommonModule,
    DatePipe,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonSearchbar
  ]
})
export class VehiculoPage implements OnInit {
  vehiculo: Vehiculo | null = null;
  servicios: Servicio[] = [];
  serviciosFiltrados: Servicio[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DbService
  ) {
    addIcons({ arrowBack, add, settings, checkmarkCircle, time, warning });
  }

  async ngOnInit() {
    await this.db.init();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const vehiculos = await this.db.obtenerVehiculos();
    this.vehiculo = vehiculos.find(v => v.id === id) || null;
    const todos = await this.db.obtenerServicios();
    this.servicios = todos
      .filter(s => s.vehiculoId === id)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    this.serviciosFiltrados = [...this.servicios];
  }

  filtrarServicios(event: any) {
    const termino = event.detail.value?.toLowerCase() || '';
    this.serviciosFiltrados = this.servicios.filter(s =>
      s.descripcion.toLowerCase().includes(termino) ||
      (s.notas || '').toLowerCase().includes(termino)
    );
  }

  iconoSync(estado: string) {
    const iconos: { [key: string]: string } = {
      ok: 'checkmark-circle',
      pendiente: 'time',
      error: 'warning'
    };
    return iconos[estado] || 'time';
  }

  colorSync(estado: string) {
    const colores: { [key: string]: string } = {
      ok: 'success',
      pendiente: 'warning',
      error: 'danger'
    };
    return colores[estado] || 'warning';
  }

  nuevoServicio() {
    this.router.navigate(['/nuevo-servicio', this.vehiculo?.id]);
  }

  irAdmin() {
    this.router.navigate(['/admin']);
  }

  volver() {
    this.router.navigate(['/buscar-placa']);
  }
}