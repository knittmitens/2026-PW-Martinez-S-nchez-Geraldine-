import { useState } from 'react';
import { pedirJSON } from '../../lib/api';
import estilos from '../../styles/Formularios.module.css';

function validarCorreo(correo) {
  if (correo.length > 100 || /\s/u.test(correo)) return false;
  const partes = correo.split('@');
  if (partes.length !== 2) return false;

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

export default function NuevoUsuario() {
  const [campos, setCampos] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    boleta: '',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  function actualizar(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  }

  async function registrar(e) {
    e.preventDefault();
    setError('');
    setExito('');
    const nombre = campos.nombre.trim();
    const correo = campos.correo.trim();

    if (!/^(?=.*\p{L})[\p{L}\p{M} ]+$/u.test(nombre)) {
      setError('El nombre solo puede contener letras y espacios; no se permiten números ni símbolos.');
      return;
    }
    const vecesPorPalabra = new Map();
    for (const palabra of nombre.split(/\s+/u)) {
      const normalizada = palabra.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
      const veces = (vecesPorPalabra.get(normalizada) || 0) + 1;
      if (veces > 2) {
        setError('No puedes repetir una misma palabra más de dos veces en el nombre.');
        return;
      }
      vecesPorPalabra.set(normalizada, veces);
    }
    if (!validarCorreo(correo)) {
      setError('Escribe un correo válido de máximo 100 caracteres y sin espacios.');
      return;
    }

    setEnviando(true);
    try {
      const usuario = await pedirJSON('/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          nombre,
          correo,
          contrasena: campos.contrasena.trim(),
          boleta: campos.boleta.trim(),
        }),
      });
      setExito(`Se registró correctamente a ${usuario.nombre}.`);
      setCampos({ nombre: '', correo: '', contrasena: '', boleta: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Registrar usuario</h1>
      <form onSubmit={registrar} className={`formulario ${estilos.formulario}`}>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          name="nombre"
          autoComplete="name"
          minLength={3}
          maxLength={100}
          pattern="(?=.*\p{L})[\p{L}\p{M} ]+"
          title="Usa solo letras y espacios. No repitas una palabra más de dos veces."
          required
          value={campos.nombre}
          onChange={actualizar}
        />

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          maxLength={100}
          title="Escribe un correo válido sin espacios."
          required
          value={campos.correo}
          onChange={actualizar}
        />

        <label htmlFor="contrasena">Contraseña</label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={64}
          required
          value={campos.contrasena}
          onChange={actualizar}
        />

        <label htmlFor="boleta">Boleta</label>
        <input
          id="boleta"
          name="boleta"
          inputMode="numeric"
          pattern="[0-9]{10}"
          maxLength={10}
          title="Escribe exactamente 10 dígitos"
          required
          value={campos.boleta}
          onChange={actualizar}
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando…' : 'Registrar usuario'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {exito && <p className={estilos.exito}>{exito}</p>}
    </main>
  );
}
