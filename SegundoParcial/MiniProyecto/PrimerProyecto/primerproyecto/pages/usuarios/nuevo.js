import { useState } from 'react';
import { pedirJSON } from '../../lib/api';
import estilos from '../../styles/Formularios.module.css';

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
    setEnviando(true);
    try {
      const usuario = await pedirJSON('/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          nombre: campos.nombre.trim(),
          correo: campos.correo.trim(),
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
