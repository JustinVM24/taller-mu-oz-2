export interface Servicio {
  id?: number;
  vehiculoId: number;
  categoriaId?: number;
  descripcion: string;
  notas?: string;
  empleadoId: number;
  empleadoNombre?: string;
  fecha: string;
  sincronizado: 'ok' | 'pendiente' | 'error';
  esBorrador: boolean;
}