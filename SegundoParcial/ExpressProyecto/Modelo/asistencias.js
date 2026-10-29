const pool = require('../db-local');
//consultar lista asistencia

async function listar() {

    const [filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
        COALESCE(a.nombre_alumno, u.nombre) AS nombre_alumno,
        COALESCE(a.nombre_alumno, u.nombre) AS usuario_nombre,
        COALESCE(a.boleta, u.boleta) AS boleta,
        t.nombre AS taller_nombre
        FROM asistencias a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        INNER JOIN talleres t ON a.taller_id = t.id
        ORDER BY a.fecha_asistencia DESC`);
        return filas;
    }
 //consultar asistencia por ID

 async function obtenerPorId(id) {
    const [filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
               COALESCE(a.nombre_alumno, u.nombre) AS nombre_alumno,
               COALESCE(a.nombre_alumno, u.nombre) AS usuario_nombre,
               COALESCE(a.boleta, u.boleta) AS boleta,
               t.nombre AS taller_nombre
        FROM asistencias a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        INNER JOIN talleres t ON a.taller_id = t.id
        WHERE a.id = ?`, [id]);
    return filas[0];
}
    
 //registra asistencia en taller

 async function crear({usuario_id, taller_id}) {
    const [info] = await pool.query(`
        INSERT INTO asistencias (usuario_id, taller_id)
        VALUES (?, ?)`,
    [usuario_id, taller_id]);
    return obtenerPorId(info.insertId);
 }

async function buscarPorUsuarioYTaller(usuario_id, taller_id) {
    const [filas] = await pool.query(
        `SELECT id FROM asistencias WHERE usuario_id = ? AND taller_id = ? LIMIT 1`,
        [usuario_id, taller_id]
    );
    return filas[0];
}

 //actualizar asistencia

async function actualizar(id, {usuario_id, taller_id}) {
    if (usuario_id === undefined && taller_id === undefined) return obtenerPorId(id);

    const [info] = await pool.query(
        `UPDATE asistencias
         SET usuario_id = CASE WHEN ? = 1 THEN ? ELSE usuario_id END,
             taller_id = CASE WHEN ? = 1 THEN ? ELSE taller_id END
         WHERE id = ?`,
        [
            usuario_id === undefined ? 0 : 1, usuario_id === undefined ? null : usuario_id,
            taller_id === undefined ? 0 : 1, taller_id === undefined ? null : taller_id,
            id
        ]
    );
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(id);
}

//eliminar una asistencia
async function eliminar(id) {
    const [filas] = await pool.query(`DELETE FROM asistencias WHERE id = ?`, [id]);
    return filas.affectedRows > 0;
}

//consultar asistencias por usuario
async function listarPorUsuario(usuario_id) {
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
               COALESCE(a.nombre_alumno, u.nombre) AS nombre_alumno,
               COALESCE(a.nombre_alumno, u.nombre) AS usuario_nombre,
               COALESCE(a.boleta, u.boleta) AS boleta
        FROM asistencias a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE a.taller_id = ?
        ORDER BY a.fecha_asistencia DESC`, [taller_id]);
    return filas;
}

async function buscarPorBoletaYTaller(boleta, taller_id) {
    const [filas] = await pool.query(`
        SELECT a.id, a.usuario_id, a.taller_id, a.fecha_asistencia, a.creado_en,
               COALESCE(a.nombre_alumno, u.nombre) AS nombre_alumno,
               COALESCE(a.nombre_alumno, u.nombre) AS usuario_nombre,
               COALESCE(a.boleta, u.boleta) AS boleta
        FROM asistencias a
        LEFT JOIN usuarios u ON a.usuario_id = u.id
        WHERE COALESCE(a.boleta, u.boleta) = ? AND a.taller_id = ?
        LIMIT 1`, [boleta, taller_id]);
    return filas[0];
}

module.exports = {
    listar,
    obtenerPorId,
    crear,
    buscarPorUsuarioYTaller,
    actualizar,
    eliminar,
    listarPorUsuario,
    listarPorTaller,
    buscarPorBoletaYTaller
};
            