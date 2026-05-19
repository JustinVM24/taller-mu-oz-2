export interface Vehiculo {
  id?: number;
  placa: string;
  propietario: string;
  modelo: string;
  anio: number;
  telefono?: string;
  tieneBorrador?: boolean;
}