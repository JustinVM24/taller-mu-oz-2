export interface Empleado {
  id?: number;
  nombre: string;
  email: string;
  rol: 'dueño' | 'empleado';
  activo: boolean;
}