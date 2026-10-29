import { useState } from 'react';
import { pedirJSON } from '../../lib/api';
import estilos from '../../styles/Formularios.module.css';
import {
  validarBoleta,
  validarContrasena,
  validarCorreo,
  validarNombreUsuario,
} from '../../lib/validaciones';

export default function NuevoUsuario() {
  const [campos, setCampos] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    boleta: '',
  });
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});
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
    const contrasena = campos.contrasena.trim();
    const boleta = campos.boleta.trim();
    const nuevosErrores = {};
    if (nombre.length < 3 || nombre.length > 100 || !validarNombreUsuario(nombre)) {
      nuevosErrores.nombre = 'Escribe de 3 a 100 caracteres, solo letras y espacios; no repitas una palabra más de dos veces.';
    }
    if (!validarCorreo(correo)) nuevosErrores.correo = 'Escribe un correo válido, sin espacios y de máximo 100 caracteres.';
    if (!validarContrasena(contrasena)) nuevosErrores.contrasena = 'Usa de 8 a 64 caracteres, sin espacios ni emojis.';
    if (!validarBoleta(boleta)) nuevosErrores.boleta = 'La boleta debe tener exactamente 10 dígitos.';
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setEnviando(true);
    try {
      const usuario = await pedirJSON('/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          nombre,
          correo,
          contrasena,
          boleta,
        }),
      });
      setExito(usuario.mensaje || `Se registró correctamente a ${nombre}.`);
      setCampos({ nombre: '', correo: '', contrasena: '', boleta: '' });
      setErrores({});
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Registrar usuario</h1>
      <form onSubmit={registrar} className={`formulario ${estilos.formulario}`} noValidate>
        <label htmlFor="nombre">Nombre completo</label>
        <input
          id="nombre"
          name="nombre"
          autoComplete="name"
          minLength={3}
          maxLength={100}
          required
          value={campos.nombre}
          onChange={actualizar}
        />
        {errores.nombre && <p className="error">{errores.nombre}</p>}

        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          maxLength={100}
          required
          value={campos.correo}
          onChange={actualizar}
        />
        {errores.correo && <p className="error">{errores.correo}</p>}

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
        {errores.contrasena && <p className="error">{errores.contrasena}</p>}

        <label htmlFor="boleta">Boleta</label>
        <input
          id="boleta"
          name="boleta"
          inputMode="numeric"
          maxLength={10}
          required
          value={campos.boleta}
          onChange={(e) => {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
            actualizar(e);
          }}
        />
        {errores.boleta && <p className="error">{errores.boleta}</p>}

        <button type="submit" disabled={enviando}>
          {enviando ? 'Registrando…' : 'Registrar usuario'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {exito && <p className={estilos.exito}>{exito}</p>}
    </main>
  );
}
