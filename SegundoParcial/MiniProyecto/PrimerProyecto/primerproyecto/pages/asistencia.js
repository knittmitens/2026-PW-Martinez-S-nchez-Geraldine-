import { useEffect, useState } from 'react';
import estilos from '../styles/Usuarios.module.css';

const API = 'http://localhost:4000/api';

async function pedirAPI(ruta, opciones) {
  let respuesta;
  try {
    respuesta = await fetch(`${API}${ruta}`, opciones);
  } catch {
    throw new Error('No se pudo cargar la información');
  }

  let datos;
  try {
    datos = await respuesta.json();
  } catch {
    throw new Error('No se pudo cargar la información');
  }
  if (!respuesta.ok) throw new Error(datos.error || 'No se pudo completar la solicitud.');
  return datos;
}

export default function Asistencia() {
  const [talleres, setTalleres] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [tallerId, setTallerId] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const [listaTalleres, listaUsuarios] = await Promise.all([
          pedirAPI('/talleres'),
          pedirAPI('/usuarios'),
        ]);
        if (!Array.isArray(listaTalleres) || !Array.isArray(listaUsuarios)) {
          throw new Error('No se pudo cargar la información');
        }
        setTalleres(listaTalleres);
        setUsuarios(listaUsuarios);
      } catch {
        setErrorCarga('No se pudo cargar la información');
      } finally {
        setCargandoDatos(false);
      }
    }
    cargarDatos();
  }, []);

  async function registrar(evento) {
    evento.preventDefault();
    setMensaje(null);
    if (!tallerId || !usuarioId) return;

    setEnviando(true);
    try {
      const datos = await pedirAPI('/asistencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taller_id: Number(tallerId),
          usuario_id: Number(usuarioId),
        }),
      });
      setMensaje({
        tipo: 'exito',
        texto: datos.mensaje || 'Asistencia registrada correctamente.',
      });
      setTallerId('');
      setUsuarioId('');
    } catch (error) {
      setMensaje({ tipo: 'error', texto: error.message });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Asistencia</h1>
      <p>Selecciona un taller y el usuario que asistió para guardar su asistencia.</p>

      <section className={estilos.tarjeta}>
        <h2>Registrar asistencia</h2>
        {cargandoDatos ? (
          <p>Cargando información…</p>
        ) : errorCarga ? (
          <p className={estilos.error} role="alert">{errorCarga}</p>
        ) : (
          <form className={estilos.formulario} onSubmit={registrar}>
            <label htmlFor="taller">Taller</label>
            <select
              id="taller"
              value={tallerId}
              onChange={(evento) => {
                setTallerId(evento.target.value);
                setUsuarioId('');
                setMensaje(null);
              }}
              required
            >
              <option value="">Selecciona un taller</option>
              {talleres.map((taller) => (
                <option key={taller.id} value={taller.id}>{taller.nombre}</option>
              ))}
            </select>

            <label htmlFor="usuario">Usuario</label>
            <select
              id="usuario"
              value={usuarioId}
              onChange={(evento) => {
                setUsuarioId(evento.target.value);
                setMensaje(null);
              }}
              disabled={!tallerId}
              required
            >
              <option value="">Selecciona un usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nombre} - {usuario.boleta}
                </option>
              ))}
            </select>

            <button type="submit" disabled={!tallerId || !usuarioId || enviando}>
              {enviando ? 'Registrando…' : 'Registrar asistencia'}
            </button>
          </form>
        )}
        {mensaje && (
          <p className={mensaje.tipo === 'exito' ? estilos.exito : estilos.error} role="status">
            {mensaje.texto}
          </p>
        )}
      </section>
    </main>
  );
}
