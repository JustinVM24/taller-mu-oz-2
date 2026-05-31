import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonSearchbar, IonList, IonItem, IonLabel,
  IonBadge, IonButton, IonIcon,
  IonTabBar, IonTabButton
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { searchOutline, settings, settingsOutline, addCircleOutline } from 'ionicons/icons';
import { DbService } from '../../core/services/db.service';
import { Vehiculo } from '../../core/models/vehiculo.model';

@Component({
  selector: 'app-buscar-placa',
  templateUrl: './buscar-placa.page.html',
  styleUrls: ['./buscar-placa.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonButton,
    IonIcon,
    IonTabBar,
    IonTabButton
  ]
})
export class BuscarPlacaPage implements OnInit {
  @ViewChild('searchbar') searchbar: any;

  sugerencias: Vehiculo[] = [];
  sinResultados = false;
  termino = '';
  nombreUsuario = '';
  esAdmin = false;

  constructor(private db: DbService, private router: Router) {
    addIcons({ searchOutline, settings, settingsOutline, addCircleOutline });
  }

  ionViewWillEnter() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  this.nombreUsuario = usuario.nombre || 'Usuario';
  this.esAdmin = usuario.rol === 'dueno';
}

  async ngOnInit() {
   

    await this.db.init();

    const vehiculos = await this.db.obtenerVehiculos();
    if (vehiculos.length === 0) {
      await this.db.guardarVehiculo({
        placa: 'ABC123',
        propietario: 'Carlos Rodriguez',
        modelo: 'Toyota Corolla',
        anio: 2020,
        telefono: '8888-8888',
        tieneBorrador: false
      });
      await this.db.guardarVehiculo({
        placa: 'XYZ789',
        propietario: 'Maria Gonzalez',
        modelo: 'Honda Civic',
        anio: 2019,
        telefono: '7777-7777',
        tieneBorrador: false
      });
      await this.db.guardarServicio({
        vehiculoId: 1,
        descripcion: 'Cambio de aceite',
        notas: 'Aceite sintetico 5W-30',
        empleadoId: 1,
        empleadoNombre: 'Juan Perez',
        fecha: new Date().toISOString(),
        sincronizado: 'ok',
        esBorrador: false
      });
    }

    setTimeout(() => this.searchbar?.setFocus(), 300);
  }

  ionViewDidEnter() {
    setTimeout(() => this.searchbar?.setFocus(), 300);
  }

  async onBuscar(event: any) {
    this.termino = event.detail.value || '';
    if (this.termino.length > 0) {
      this.sugerencias = await this.db.buscarPorPlaca(this.termino);
      this.sinResultados = this.sugerencias.length === 0;
    } else {
      this.sugerencias = [];
      this.sinResultados = false;
    }
  }

  seleccionarVehiculo(v: Vehiculo) {
    this.router.navigate(['/vehiculo', v.id]);
  }

  irAdmin() {
    this.router.navigate(['/admin']);
  }

  irAgregarVehiculo() {
    this.router.navigate(['/nuevo-vehiculo']);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}