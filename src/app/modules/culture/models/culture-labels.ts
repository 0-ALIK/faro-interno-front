export type LibraryStatus = 'ACTIVE' | 'INACTIVE' | 'STANDOUT';
export type LibraryZone = 'NORTH' | 'CENTER' | 'EAST' | 'WEST' | 'SOUTH';

export const LIBRARY_STATUS_LABELS: Record<LibraryStatus, string> = {
  ACTIVE: 'Activo',
  INACTIVE: 'Inactivo',
  STANDOUT: 'Destacado'
};

export const LIBRARY_ZONE_LABELS: Record<LibraryZone, string> = {
  NORTH: 'Norte',
  CENTER: 'Centro',
  EAST: 'Este',
  WEST: 'Oeste',
  SOUTH: 'Sur'
};

export const DAY_LABELS: Record<number, string> = {
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado',
  7: 'Domingo'
};

export function labelOf<T extends string>(
  labels: Record<T, string>,
  value: T | null | undefined
): string {
  return value ? labels[value] : '—';
}
