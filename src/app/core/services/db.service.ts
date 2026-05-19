import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Vehiculo } from '../models/vehiculo.model';
import { Servicio } from '../models/servicio.model';

@Injectable({ providedIn: 'root' })
export class DbService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {}

  async init() {
    this._storage = await this.storage.create();
  }

  async guardarVehiculo(vehiculo: Vehiculo): Promise<void> {
    const vehiculos = await this.obtenerVehiculos();
    vehiculos.push({ ...vehiculo, id: Date.now() });
    await this._storage?.set('vehiculos', vehiculos);
  }

  async buscarPorPlaca(termino: string): Promise<Vehiculo[]> {
    const todos = await this.obtenerVehiculos();
    return todos.filter(v =>
      v.placa.toLowerCase().includes(termino.toLowerCase())
    );
  }

  async obtenerVehiculos(): Promise<Vehiculo[]> {
    return (await this._storage?.get('vehiculos')) || [];
  }

  async guardarServicio(servicio: Servicio): Promise<void> {
    const servicios = await this.obtenerServicios();
    servicios.push({ ...servicio, id: Date.now() });
    await this._storage?.set('servicios', servicios);
  }

  async obtenerServicios(): Promise<Servicio[]> {
    return (await this._storage?.get('servicios')) || [];
  }
}