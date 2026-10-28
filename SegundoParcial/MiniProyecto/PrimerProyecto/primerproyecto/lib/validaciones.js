// reglas q valida el backend
export function validarBoleta(boleta) {
  return typeof boleta === 'string' && /^\d{10}$/.test(boleta.trim());
}
