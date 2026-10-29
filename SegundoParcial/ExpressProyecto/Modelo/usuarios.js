const pool = require('../db-local');

async function listarUsuarios() {
    const [filas] = await pool.query(
        'SELECT id, nombre, boleta FROM usuarios ORDER BY nombre'
    );
    return filas;
}

async function obtenerPorId(id) {
    const [filas] = await pool.query(
        'SELECT id, nombre, correo, boleta, rol FROM usuarios WHERE id = ?',
        [id]
    );
    return filas[0];
}

async function crearUsuario(nombre, correo, contrasenaHash, boleta) {
    const [info] = await pool.query(
        `INSERT INTO usuarios (nombre, correo, contrasena, boleta) VALUES (?, ?, ?, ?)`,
        [nombre, correo, contrasenaHash, boleta]
    );
    return obtenerPorId(info.insertId);
}

async function actualizar(id, {nombre, correo, rol}) {
    if (nombre === undefined && correo === undefined && rol === undefined) {
        return obtenerPorId(id);
    }

    const [info] = await pool.query(
        `UPDATE usuarios
         SET nombre = CASE WHEN ? = 1 THEN ? ELSE nombre END,
             correo = CASE WHEN ? = 1 THEN ? ELSE correo END,
             rol = CASE WHEN ? = 1 THEN ? ELSE rol END
         WHERE id = ?`,
        [
            nombre === undefined ? 0 : 1, nombre === undefined ? null : nombre,
            correo === undefined ? 0 : 1, correo === undefined ? null : correo,
            rol === undefined ? 0 : 1, rol === undefined ? null : rol,
            id
        ]
    );
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(id);
}

async function eliminar(id) {
    const [filas] = await pool.query(`DELETE FROM usuarios WHERE id = ?`, [id]);
    return filas.affectedRows > 0;
}

async function obtenerPorBoleta(boleta) {
    const [filas] = await pool.query(
        `SELECT id, nombre, correo, boleta, rol FROM usuarios WHERE boleta = ?`,
        [boleta]
    );
    return filas[0];
}

module.exports = {
    listarUsuarios,
    obtenerPorId,
    crearUsuario,
    obtenerPorBoleta,
    actualizar,
    eliminar
};