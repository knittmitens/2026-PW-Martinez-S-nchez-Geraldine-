// reglas q valida el backend
export function validarNombreUsuario(nombre) {
  if (
    typeof nombre !== 'string'
    || nombre.length < 3
    || nombre.length > 100
    || !/^(?=.*\p{L})[\p{L}\p{M} ]+$/u.test(nombre)
  ) {
    return false;
  }

  const repeticiones = new Map();
  for (const palabra of nombre.trim().split(/\s+/u)) {
    const normalizada = palabra.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
    const cantidad = (repeticiones.get(normalizada) || 0) + 1;
    if (cantidad > 2) return false;
    repeticiones.set(normalizada, cantidad);
  }
  return true;
}

export function validarCorreo(correo) {
  if (typeof correo !== 'string') return false;
  const texto = correo.trim();
  const partes = texto.split('@');
  if (texto.length > 100 || /\s/u.test(texto) || partes.length !== 2) return false;

  const [local, dominio] = partes;
  const patronLocal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
  const patronDominio = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return local.length <= 64
    && patronLocal.test(local)
    && !local.startsWith('.')
    && !local.endsWith('.')
    && !local.includes('..')
    && dominio.length <= 253
    && patronDominio.test(dominio);
}

export function validarContrasena(contrasena) {
  return typeof contrasena === 'string'
    && contrasena.length >= 8
    && contrasena.length <= 64
    && !/\s/u.test(contrasena)
    && !/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{20E3}\u{E0020}-\u{E007F}]/u.test(contrasena);
}

export function validarBoleta(boleta) {
  return typeof boleta === 'string' && /^\d{10}$/.test(boleta.trim());
}
