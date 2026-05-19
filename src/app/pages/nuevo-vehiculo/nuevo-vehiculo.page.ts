import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar,
  IonButton, IonIcon, IonInput
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, save } from 'ionicons/icons';
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
    IonInput
  ]
})
export class NuevoVehiculoPage implements OnInit {
  placa = '';
  propietario = '';
  modelo = '';
  anio = new Date().getFullYear();
  telefono = '';
  errorMensaje = '';

  constructor(private router: Router, private db: DbService) {
    addIcons({ arrowBack, save });
  }

  async ngOnInit() {
    await this.db.init();
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
    this.router.navigate(['/buscar-placa']);
  }

  cancelar() {
    this.router.navigate(['/buscar-placa']);
  }
}