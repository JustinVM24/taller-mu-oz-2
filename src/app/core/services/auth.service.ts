import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null;
  }

  estaLogueado(): boolean {
    return this.getUsuario() !== null;
  }

  esDueno(): boolean {
    const usuario = this.getUsuario();
    return usuario?.rol === 'dueno';
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
  }

  getNombre(): string {
    return this.getUsuario()?.nombre || 'Usuario';
  }
}