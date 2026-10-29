import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { pedirJSON } from '../../lib/api';
import { formatearFecha, ocultarBoleta } from '../../lib/formato';
import { validarBoleta } from '../../lib/validaciones';
import estilos from '../../styles/Talleres.module.css';

export default function DetalleTaller() {
  const router = useRouter();
  const { id } = router.query;

  const [taller, setTaller] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [errorCarga, setErrorCarga] = useState('');

  const [boleta, setBoleta] = useState('');
  const [errorForm, setErrorForm] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // En el primer render router.query todavía viene vacío: hay que esperar
    // a router.isReady.
    if (!router.isReady) return;

    // Si se llegó desde /perfil, la boleta viene en la URL.
    if (router.query.boleta) setBoleta(String(router.query.boleta));

    cargar();
  }, [router.isReady, id]);

  async function cargar() {
    try {
      setTaller(await pedirJSON(`/talleres/${id}`));
      setAsistencias(await pedirJSON(`/talleres/${id}/asistencias`));
      setErrorCarga('');
    } catch (err) {
      setErrorCarga(err.message);
    }
  }

  // Lugares: se calculan con lo que ya está en el estado (cada vez que
  // cambia, React vuelve a calcular).
  const ocupados = asistencias.length;
  const libres = taller ? Math.max(0, taller.cupo - ocupados) : 0;
  const lleno = taller !== null && libres === 0;

  async function inscribir(e) {
    e.preventDefault();
    setErrorForm('');
    setExito('');

    const boletaLimpia = boleta.trim();
    if (!validarBoleta(boletaLimpia)) {
      return setErrorForm('La boleta debe tener 10 dígitos.');
    }
    if (asistencias.some((a) => a.boleta === boletaLimpia)) {
      return setErrorForm('Esa boleta ya está inscrita en este taller.');
    }
    if (lleno) return setErrorForm('El taller ya no tiene lugares.');

    setEnviando(true);
    try {
      const usuario = await pedirJSON(`/usuarios/boleta/${encodeURIComponent(boletaLimpia)}`);
      await pedirJSON('/asistencias', {
        method: 'POST',
        body: JSON.stringify({
          taller_id: Number(id),
          usuario_id: usuario.id,
        }),
      });
      setExito(`¡Listo! ${usuario.nombre} quedó inscrito(a) en el taller.`);
      setBoleta('');
      await cargar();
    } catch (err) {
      setErrorForm(err.message);
    } finally {
      setEnviando(false);
    }
  }

  if (errorCarga) {
    return (
      <main>
        <p className="error">{errorCarga}</p>
        <Link className={estilos.volver} href="/talleres">
          ← Volver a talleres
        </Link>
      </main>
    );
  }

  if (!taller) {
    return (
      <main>
        <p>Cargando taller…</p>
      </main>
    );
  }

  const porcentaje = Math.min(100, (ocupados / taller.cupo) * 100);

  return (
    <main>
      <Link className={estilos.volver} href="/talleres">
        ← Volver a talleres
      </Link>
      <h1>{taller.nombre}</h1>

      <section className={estilos.panel}>
        <p>
          <strong>Instructor:</strong> {taller.instructor || 'Por confirmar'}
        </p>
        <p>
          <strong>Fecha:</strong> {formatearFecha(taller.fecha)}
        </p>
        <div className={estilos.barra}>
          <div className={estilos.relleno} style={{ width: `${porcentaje}%` }} />
        </div>
        <p>
          {ocupados} de {taller.cupo} lugares ocupados ·{' '}
          {lleno ? (
            <span className={estilos.lleno}>Taller lleno</span>
          ) : (
            `${libres} ${libres === 1 ? 'lugar libre' : 'lugares libres'}`
          )}
        </p>
      </section>

      <section className={estilos.panel}>
        <h2>Inscribirme</h2>
        <form onSubmit={inscribir} className="formulario">
          <input
            placeholder="Boleta (10 dígitos)"
            value={boleta}
            onChange={(e) => setBoleta(e.target.value)}
          />
          <button type="submit" disabled={lleno || enviando}>
            {lleno ? 'Sin lugares' : enviando ? 'Inscribiendo…' : 'Inscribirme'}
          </button>
        </form>
        {errorForm && <p className="error">{errorForm}</p>}
        {exito && <p className={estilos.exito}>{exito}</p>}
      </section>

      <h2>Inscritos ({ocupados})</h2>
      {ocupados === 0 ? (
        <p>Todavía no hay inscritos. ¡Sé el primero!</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Boleta</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.nombre_alumno}</td>
                <td>{ocultarBoleta(a.boleta)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
