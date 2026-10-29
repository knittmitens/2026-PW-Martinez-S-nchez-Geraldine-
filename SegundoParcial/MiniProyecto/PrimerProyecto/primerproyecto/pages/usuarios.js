import { useState } from 'react';
import { validarBoleta, validarContrasena, validarCorreo, validarNombreUsuario } from '../lib/validaciones';
import estilos from '../styles/Usuarios.module.css';

const API = 'http://localhost:4000/api';

async function pedirAPI(ruta, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(`${API}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo conectar con el servidor.');
  }

  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('El servidor devolvió una respuesta inválida.');
  }

  if (!respuesta.ok) throw new Error(datos.error || datos.mensaje || 'No se pudo completar la solicitud.');
  return datos;
}

export default function Usuarios() {
  const [campos, setCampos] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    boleta: '',
  });
  const [errores, setErrores] = useState({});
  const [mensajeCrear, setMensajeCrear] = useState(null);
  const [cargandoCrear, setCargandoCrear] = useState(false);
  const [boletaConsulta, setBoletaConsulta] = useState('');
  const [errorConsulta, setErrorConsulta] = useState('');
  const [mensajeConsulta, setMensajeConsulta] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [cargandoConsulta, setCargandoConsulta] = useState(false);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setCampos((actuales) => ({ ...actuales, [name]: value }));
    setErrores((actuales) => ({ ...actuales, [name]: '' }));
  }

  function validarCampos() {
    const valores = {
      nombre: campos.nombre.trim(),
      correo: campos.correo.trim(),
      contrasena: campos.contrasena.trim(),
      boleta: campos.boleta.trim(),
    };
    const nuevosErrores = {};

    if (valores.nombre.length < 3 || valores.nombre.length > 100 || !validarNombreUsuario(valores.nombre)) {
      nuevosErrores.nombre = 'Escribe de 3 a 100 caracteres, solo letras y espacios; no repitas una palabra más de dos veces.';
    }
    if (!validarCorreo(valores.correo)) {
      nuevosErrores.correo = 'Escribe un correo válido, sin espacios y de máximo 100 caracteres.';
    }
    if (!validarContrasena(valores.contrasena)) {
      nuevosErrores.contrasena = 'Usa de 8 a 64 caracteres, sin espacios ni emojis.';
    }
    if (!validarBoleta(valores.boleta)) {
      nuevosErrores.boleta = 'La boleta debe tener exactamente 10 dígitos.';
    }

    return { valores, nuevosErrores };
  }

  async function crearUsuario(evento) {
    evento.preventDefault();
    setMensajeCrear(null);
    const { valores, nuevosErrores } = validarCampos();
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    setCargandoCrear(true);
    try {
      const datos = await pedirAPI('/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(valores),
      });
      setMensajeCrear({ tipo: 'exito', texto: datos.mensaje || 'Usuario creado correctamente.' });
      setCampos({ nombre: '', correo: '', contrasena: '', boleta: '' });
      setErrores({});
    } catch (error) {
      setMensajeCrear({ tipo: 'error', texto: error.message });
    } finally {
      setCargandoCrear(false);
    }
  }

  async function consultarUsuario(evento) {
    evento.preventDefault();
    setErrorConsulta('');
    setMensajeConsulta(null);
    setUsuario(null);
    const boleta = boletaConsulta.trim();
    if (!validarBoleta(boleta)) {
      setErrorConsulta('La boleta debe tener exactamente 10 dígitos.');
      return;
    }

    setCargandoConsulta(true);
    try {
      const datos = await pedirAPI(`/usuarios/boleta/${encodeURIComponent(boleta)}`);
      setUsuario(datos);
      setMensajeConsulta({ tipo: 'exito', texto: 'Usuario encontrado.' });
    } catch (error) {
      setMensajeConsulta({ tipo: 'error', texto: error.message });
    } finally {
      setCargandoConsulta(false);
    }
  }

  return (
    <main>
      <h1>Usuarios</h1>
      <p>Crea una cuenta y consulta los datos de un usuario mediante su boleta.</p>

      <div className={estilos.contenedor}>
        <section className={estilos.tarjeta}>
          <h2>Crear usuario</h2>
          <form className={estilos.formulario} onSubmit={crearUsuario} noValidate>
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              name="nombre"
              autoComplete="name"
              maxLength={100}
              required
              value={campos.nombre}
              onChange={cambiarCampo}
            />
            {errores.nombre && <p className={estilos.campoError}>{errores.nombre}</p>}

            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              maxLength={100}
              required
              value={campos.correo}
              onChange={cambiarCampo}
            />
            {errores.correo && <p className={estilos.campoError}>{errores.correo}</p>}

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
              onChange={cambiarCampo}
            />
            {errores.contrasena && <p className={estilos.campoError}>{errores.contrasena}</p>}

            <label htmlFor="boleta">Boleta</label>
            <input
              id="boleta"
              name="boleta"
              inputMode="numeric"
              maxLength={10}
              required
              value={campos.boleta}
              onChange={(evento) => {
                evento.target.value = evento.target.value.replace(/\D/g, '').slice(0, 10);
                cambiarCampo(evento);
              }}
            />
            {errores.boleta && <p className={estilos.campoError}>{errores.boleta}</p>}

            <button type="submit" disabled={cargandoCrear}>
              {cargandoCrear ? 'Creando…' : 'Crear usuario'}
            </button>
          </form>
          {mensajeCrear && (
            <p className={mensajeCrear.tipo === 'exito' ? estilos.exito : estilos.error} role="status">
              {mensajeCrear.texto}
            </p>
          )}
        </section>

        <section className={estilos.tarjeta}>
          <h2>Consultar usuario por boleta</h2>
          <form className={estilos.formulario} onSubmit={consultarUsuario} noValidate>
            <label htmlFor="boleta-consulta">Boleta</label>
            <input
              id="boleta-consulta"
              inputMode="numeric"
              maxLength={10}
              required
              value={boletaConsulta}
              onChange={(evento) => {
                setBoletaConsulta(evento.target.value.replace(/\D/g, '').slice(0, 10));
                setErrorConsulta('');
              }}
            />
            {errorConsulta && <p className={estilos.campoError}>{errorConsulta}</p>}
            <button type="submit" disabled={cargandoConsulta}>
              {cargandoConsulta ? 'Consultando…' : 'Consultar'}
            </button>
          </form>
          {mensajeConsulta && (
            <p className={mensajeConsulta.tipo === 'exito' ? estilos.exito : estilos.error} role="status">
              {mensajeConsulta.texto}
            </p>
          )}
          {usuario && (
            <div className={estilos.datos}>
              <p><strong>Nombre:</strong> {usuario.nombre}</p>
              <p><strong>Correo:</strong> {usuario.correo}</p>
              <p><strong>Boleta:</strong> {usuario.boleta}</p>
              <p><strong>Rol:</strong> {usuario.rol}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
