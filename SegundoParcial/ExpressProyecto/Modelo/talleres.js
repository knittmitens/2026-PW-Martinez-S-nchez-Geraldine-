const pool = require('../db-local');

const COLUMNAS_PUBLICAS = 'id, nombre, descripcion, instructor, fecha, cupo, create_at';

//consultar los talleres
async function listar() {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM talleres ORDER BY id`);
    return filas;
}

// consultar taller por iid

async function obtenerPorId(id) {
    const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM talleres WHERE id = ?`, [id]);
    return filas[0]
}

//registrar un nuevo taller 
async function crear({nombre, descripcion, instructor, fecha, cupo}) {
    const[info] = await pool.query (`
        INSERT INTO talleres (nombre, descripcion, instructor, fecha, cupo) VALUES (?, ?, ?, ?, ?)`,
        [nombre, descripcion, instructor, fecha, cupo]);
        return obtenerPorId(info.insertId);
    }

    //actualizar un taller 
    async function actualizar(id, {nombre , descripcion, instructor, fecha, cupo}) {
        const cambios = Object.entries({nombre, descripcion, instructor, fecha, cupo}).filter(([, valor]) => valor !== undefined);
        if(cambios.length === 0) return obtenerPorId(id);

        const columnas = cambios.map(([columna]) => `${columna} = ?`).join(', ');
        const [info] = await pool.query(`UPDATE talleres SET ${columnas} WHERE id = ?`, [...cambios.map(([, valor]) => valor), id]);
    if(info.affectedRows === 0) return undefined;
    return obtenerPorId(info.insertId);
    
}

//elinimar taller
async function eliminar(id) {
    const [filas] = await pool.query(`DELETE FROM talleres WHERE id = ?`, [id]);
    return filas.affectedRows > 0;
}
    //consultar disponibles 
    async function consultarDisponibles() {
        const [filas] = await pool.query(`SELECT ${COLUMNAS_PUBLICAS} FROM talleres WHERE cupo > 0 ORDER BY fecha`);
    return filas;
}
        
    
module.exports = {listar, obtenerPorId, crear, actualizar, eliminar, consultarDisponibles};
