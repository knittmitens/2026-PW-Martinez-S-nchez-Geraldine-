const asistenciasModel = require('../Modelo/asistencias');
const usuariosModel = require('../Modelo/usuarios');
const talleresModel = require('../Modelo/talleres');

function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

//consulta asistencias
async function ListarAsistencias(req, res) {
    try {
        const asistencias = await asistenciasModel.listar();
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

//consulta asistencias por taller
async function ListarAsistenciasPorTaller(req, res) {
    try {
        const asistencias = await asistenciasModel.listarPorTaller(req.params.taller_id);
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

//consulta asistencia por id
async function obtenerAsistencia(req, res) {
    try {
        const asistencia = await asistenciasModel.obtenerPorId(req.params.id);
        if (!asistencia) return res.status(404).json({ error: 'Asistencia no encontrada' }); 
        res.json(asistencia);
    }catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
// asistencia en taller
async function crearAsistencia(req, res) {
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        return res.status(400).json({ error: 'El cuerpo debe ser un objeto JSON' });
    }
    const { usuario_id, taller_id } = body;
    if (!Number.isInteger(taller_id) || taller_id <= 0) {
        return res.status(400).json({ error: 'El taller debe ser un entero positivo' });
    }
    if (!Number.isInteger(usuario_id) || usuario_id <= 0) {
        return res.status(400).json({ error: 'El usuario debe ser un entero positivo' });
    }

    try {
        const taller = await talleresModel.obtenerPorId(taller_id);
        if (!taller) return res.status(404).json({ error: 'No existe un taller con ese ID' });

        const usuario = await usuariosModel.obtenerPorId(usuario_id);
        if (!usuario) return res.status(404).json({ error: 'No existe un usuario con ese ID' });

        const existente = await asistenciasModel.buscarPorUsuarioYTaller(usuario_id, taller_id);
        if (existente) {
            return res.status(409).json({ error: 'El usuario ya está registrado en este taller' });
        }

        const asistencia = await asistenciasModel.crear({ usuario_id, taller_id });
        res.status(201).json({ mensaje: 'Asistencia registrada correctamente.', asistencia });
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ error: 'El usuario ya está registrado en este taller' });
        }
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function eliminarAsistencia(req, res) {
    try {
        const eliminada = await asistenciasModel.eliminar(req.params.id);
        if (!eliminada) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    ListarAsistencias,
    ListarAsistenciasPorTaller,
    obtenerAsistencia,
    crearAsistencia,
    eliminarAsistencia
};