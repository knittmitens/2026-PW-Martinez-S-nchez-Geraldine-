const pool = require('../db-local');
const COLUMNAS_PUBLICAS = 'id, usuario_id, taller_id, fecha_asistencia, creado_en';

//consultar lista asistencia

async function listar() {

    const [filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
        u.nombre AS usuario_nombre, u.boleta,
        t.nombre AS taller_nombre
        FROM asistencias a
        INNER JOIN usuarios u ON a.usuario_id = u.id
        INNER JOIN talleres t ON a.taller_id = t.id
        ORDER BY a.fecha_asistencia DESC`);
        return filas;
    }
 //consultar asistencia por ID

 async function obtenerPorId(id) {
    const [filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
               u.nombre AS usuario_nombre, u.boleta,
               t.nombre AS taller_nombre
        FROM asistencias a
        INNER JOIN usuarios u ON a.usuario_id = u.id
        INNER JOIN talleres t ON a.taller_id = t.id
        WHERE a.id = ?`, [id]);
    return filas[0];
}
    
 //registra asistencia en taller

 async function crear({usuario_id, taller_id}) {
    const [info] = await pool.query(`
        INSERT INTO asistencias (usuario_id, taller_id) VALUES (?, ?)`,
    [usuario_id, taller_id]);
    return obtenerPorId(info.insertId);
 }

 //actualizar asistencia

async function actualizar(id, {usuario_id, taller_id}) {
    const cambios = Object.entries({usuario_id, taller_id}).filter(([, valor]) => valor !== undefined);
    if(cambios.length === 0) return obtenerPorId(id);
    
    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
      const [info] = await pool.query(`UPDATE asistencias SET ${columnas} WHERE id = ?`, [...cambios.map(([, valor]) => valor), id]);
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(id);
}

//eliminar una asistencia
async function eliminar(id) {
    const [filas] = await pool.query(`DELETE FROM asistencias WHERE id = ?`, [id]);
    return filas.affectedRows > 0;
}

//consultar asistencias por usuario
async function ListarPorUsuario(usuario_id) {
    const[filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
        t.nombre AS taller_nombre, t.fecha AS taller_fecha
        FROM asistencias a
        INNER JOIN talleres t ON a.taller_id = t.id
        WHERE a.usuario_id = ?
        ORDER BY a.fecha_asistencia DESC`, [usuario_id]);
        return filas;
        }

        //consultar asistencias por taller 
        async function listarPorTaller(taller_id) {
            const [filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
               u.nombre AS usuario_nombre, u.boleta
        FROM asistencias a
        INNER JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.taller_id = ?
        ORDER BY a.fecha_asistencia DESC`, [taller_id]);
    return filas;
}

module.exports = {listar, obtenerPorId, crear, actualizar, eliminar, listarPorUsuario, listarPorTaller};
            