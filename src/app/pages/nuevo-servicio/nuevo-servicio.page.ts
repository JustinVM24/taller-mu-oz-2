import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar,
  IonButton, IonIcon, IonTextarea
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, save, wifi, wifiOutline } from 'ionicons/icons';
import { DbService } from '../../core/services/db.service';
import { Servicio } from '../../core/models/servicio.model';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.page.html',
  styleUrls: ['./nuevo-servicio.page.scss'],
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
export class NuevoServicioPage implements OnInit {
  vehiculoId = 0;
  categoriaSeleccionada = '';
  notas = '';
  esOtro = false;
  descripcionOtro = '';
  enLinea = navigator.onLine;

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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: DbService
  ) {
    addIcons({ arrowBack, save, wifi, wifiOutline });
  }

  async ngOnInit() {
    await this.db.init();
    this.vehiculoId = Number(this.route.snapshot.paramMap.get('id'));
    window.addEventListener('online', () => { this.enLinea = true; });
    window.addEventListener('offline', () => { this.enLinea = false; });
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
    const descripcion = this.esOtro ? this.descripcionOtro : this.categoriaSeleccionada;
    if (!descripcion) { return; }
    const servicio: Servicio = {
      vehiculoId: this.vehiculoId,
      descripcion: descripcion,
      notas: this.notas,
      empleadoId: 1,
      empleadoNombre: 'Empleado',
      fecha: new Date().toISOString(),
      sincronizado: this.enLinea ? 'ok' : 'pendiente',
      esBorrador: false
    };
    await this.db.guardarServicio(servicio);
    this.router.navigate(['/vehiculo', this.vehiculoId]);
  }

  cancelar() {
    this.router.navigate(['/vehiculo', this.vehiculoId]);
  }
}