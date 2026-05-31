import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar,
  IonButton, IonIcon, IonTextarea
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, save, add, trash } from 'ionicons/icons';
import { DbService } from '../../core/services/db.service';
import { Vehiculo } from '../../core/models/vehiculo.model';

@Component({
  selector: 'app-nuevo-vehiculo',
  templateUrl: './nuevo-vehiculo.page.html',
  styleUrls: ['./nuevo-vehiculo.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonIcon,
    IonTextarea
  ]
})
export class NuevoVehiculoPage implements OnInit {
  placa = '';
  propietario = '';
  modelo = '';
  anio = new Date().getFullYear();
  telefono = '';
  errorMensaje = '';

  agregarServicio = false;
  categoriaSeleccionada = '';
  esOtro = false;
  descripcionOtro = '';
  notas = '';

  categorias = [
    'Cambio de aceite',
    'Revision de frenos',
    'Alineacion y balanceo',
    'Cambio de llantas',
    'Revision general',
    'Cambio de filtros',
    'Reparacion de motor',
    'Reparacion de transmision'
  ];

  constructor(private router: Router, private db: DbService) {
    addIcons({ arrowBack, save, add, trash });
  }

  async ngOnInit() {
    await this.db.init();
  }

  seleccionarCategoria(cat: string) {
    this.categoriaSeleccionada = cat;
    this.esOtro = false;
  }

  seleccionarOtro() {
    this.categoriaSeleccionada = 'otro';
    this.esOtro = true;
  }

  async guardar() {
    if (!this.placa || !this.propietario || !this.modelo) {
      this.errorMensaje = 'Placa, propietario y modelo son obligatorios.';
      return;
    }

    const vehiculo: Vehiculo = {
      placa: this.placa.toUpperCase(),
      propietario: this.propietario,
      modelo: this.modelo,
      anio: this.anio,
      telefono: this.telefono,
      tieneBorrador: false
    };

    await this.db.guardarVehiculo(vehiculo);

    const vehiculos = await this.db.obtenerVehiculos();
    const nuevoVehiculo = vehiculos[vehiculos.length - 1];

    if (this.agregarServicio && this.categoriaSeleccionada) {
      const descripcion = this.esOtro ? this.descripcionOtro : this.categoriaSeleccionada;
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      await this.db.guardarServicio({
        vehiculoId: nuevoVehiculo.id!,
        descripcion,
        notas: this.notas,
        empleadoId: usuario.id || 1,
        empleadoNombre: usuario.nombre || 'Empleado',
        fecha: new Date().toISOString(),
        sincronizado: navigator.onLine ? 'ok' : 'pendiente',
        esBorrador: false
      });
    }

    this.router.navigate(['/vehiculo', nuevoVehiculo.id]);
  }

  cancelar() {
    this.router.navigate(['/buscar-placa']);
  }
}