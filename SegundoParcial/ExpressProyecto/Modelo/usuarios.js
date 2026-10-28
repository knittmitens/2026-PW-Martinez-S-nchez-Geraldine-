const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, correo, boleta, rol';

//consultar todos los usuarios
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios ORDER BY id`);
    return filas;
}

//consultar ID
async function obtenerPorId(id) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM usuarios WHERE id = ?`, [id]);
    return filas[0];
}

//registrar usuario
async function crear({nombre, correo, contrasenaHash, boleta, rol}) {
    const [info] = await pool.query(`INSERT INTO usuarios (nombre, correo, contrasena_hash, boleta, rol) VALUES(?, ?, ?, ?, ?)`,
    [nombre, correo, contrasenaHash, boleta, rol || 'alumno']);
    return obtenerPorId(info.insertId);
}

//actualiza alumno
async function actualizar(id, {nombre, correo, rol}) {
    const cambios = Object.entries({nombre, correo, rol}).filter(([, valor]) => valor !== undefined);
    if(cambios.length === 0) return obtenerPorId(id);

    const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
    const [info] = await pool.query(`UPDATE usuarios SET ${columnas} WHERE id = ?`, [...cambios.map(([, valor]) => valor), id]);
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(id);
}

//eliminar
async function eliminar(id) {
    const [filas] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [id]);
    return filas.affectedRows > 0;
}

//buscar correo
async function buscarCorreoConHash(correo) {
    const [filas] = await pool.query(`SELECT * FROM usuarios WHERE correo = ?`, [correo]);
    return filas[0];
}

//buscar boleta
async function buscarBoleta(boleta) {
    const [filas] = await pool.query(
        `SELECT id, nombre, correo, boleta, rol FROM usuarios WHERE boleta = ?`,
        [boleta]
    );
    return filas[0];
}

module.exports = {listar, obtenerPorId, crear, actualizar, eliminar, buscarPorCorreoConHash, buscarPorBoleta};