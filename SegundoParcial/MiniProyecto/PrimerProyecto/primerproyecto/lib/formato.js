// Fechas en español sin el corrimiento de un día que provoca new Date('YYYY-MM-DD').
export function formatearFecha(fecha) {
  if (!fecha) return '';
  return new Date(`${fecha}T12:00:00`).toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// true si la fecha ya pasó (comparando contra hoy a medianoche).
export function yaPaso(fecha) {
  if (!fecha) return false;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return new Date(`${fecha}T12:00:00`) < hoy;
}

// La boleta es un dato personal: solo se muestran los últimos 4 dígitos.
export function ocultarBoleta(boleta) {
  if (!boleta) return '';
  return `******${String(boleta).slice(-4)}`;
}
