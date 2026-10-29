import { useState } from 'react';
import { useRouter } from 'next/router';
import { pedirJSON } from '../../lib/api';
import estilos from '../../styles/Formularios.module.css';

export default function CrearTaller() {
  const router = useRouter();
  const [campos, setCampos] = useState({
    nombre: '',
    descripcion: '',
    instructor: '',
    fecha: '',
    cupo: '30',
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  function actualizar(e) {
    setCampos({ ...campos, [e.target.name]: e.target.value });
  }

  async function crear(e) {
    e.preventDefault();
    setError('');
    setExito('');
    setEnviando(true);
    try {
      const taller = await pedirJSON('/talleres', {
        method: 'POST',
        body: JSON.stringify({
          nombre: campos.nombre.trim(),
          descripcion: campos.descripcion.trim(),
          instructor: campos.instructor.trim(),
          fecha: campos.fecha,
          cupo: Number(campos.cupo),
        }),
      });
      setExito(`Se creó correctamente el taller "${taller.nombre}".`);
      setCampos({
        nombre: '',
        descripcion: '',
        instructor: '',
        fecha: '',
        cupo: '30',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main>
      <h1>Crear taller</h1>
      <form onSubmit={crear} className={`formulario ${estilos.formulario}`}>
        <label htmlFor="nombre">Nombre del taller</label>
        <input
          id="nombre"
          name="nombre"
          maxLength={150}
          required
          value={campos.nombre}
          onChange={actualizar}
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={campos.descripcion}
          onChange={actualizar}
        />

        <label htmlFor="instructor">Instructor</label>
        <input
          id="instructor"
          name="instructor"
          maxLength={100}
          value={campos.instructor}
          onChange={actualizar}
        />

        <label htmlFor="fecha">Fecha</label>
        <input
          id="fecha"
          name="fecha"
          type="date"
          required
          value={campos.fecha}
          onChange={actualizar}
        />

        <label htmlFor="cupo">Cupo</label>
        <input
          id="cupo"
          name="cupo"
          type="number"
          min="1"
          step="1"
          required
          value={campos.cupo}
          onChange={actualizar}
        />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Creando…' : 'Crear taller'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {exito && (
        <p className={estilos.exito}>
          {exito}{' '}
          <button type="button" onClick={() => router.push('/talleres')}>
            Ver talleres
          </button>
        </p>
      )}
    </main>
  );
}
