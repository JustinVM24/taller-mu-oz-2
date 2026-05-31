import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar
  ]
})
export class LoginPage implements OnInit {
  email = '';
  password = '';
  errorMensaje = '';

  usuarios = [
    { email: 'carlos@tallermunoz.com', password: '1234', rol: 'dueno', nombre: 'Carlos Munoz' },
    { email: 'juan@tallermunoz.com', password: '1234', rol: 'empleado', nombre: 'Juan Perez' },
    { email: 'maria@tallermunoz.com', password: '1234', rol: 'empleado', nombre: 'Maria Gonzalez' }
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  onEmailChange(event: Event) {
    this.email = (event.target as HTMLInputElement).value;
  }

  onPasswordChange(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  iniciarSesion() {
    const usuario = this.usuarios.find(
      u => u.email === this.email && u.password === this.password
    );
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      this.router.navigate(['/buscar-placa']);
    } else {
      this.errorMensaje = 'Correo o contrasena incorrectos.';
    }
  }
}