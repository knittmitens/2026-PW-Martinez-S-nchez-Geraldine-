const asistenciasModel = require('../Modelo/asistencias');
const usuariosModel = require('../Modelo/usuarios');
const { validarBoleta } = require('../validaciones');

function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

//consulta asistencias
async function ListarAsistencias(req, res) {
    try {
        const asistencias = await asistenciasModel.listar();
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

//consulta asistencias por taller
async function ListarAsistenciasPorTaller(req, res) {
    try {
        const asistencias = await asistenciasModel.listarPorTaller(req.params.taller_id);
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//consulta asistencia por id
async function obtenerAsistencia(req, res) {
    try {
        const asistencia = await asistenciasModel.obtenerPorId(req.params.id);
        if (!asistencia) return res.status(404).json({ error: 'Asistencia no encontrada' }); 
        res.json(asistencia);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// asistencia en taller
async function crearAsistencia(req, res) {
    const { usuario_id, taller_id, nombre_alumno } = req.body;
    const boletaTexto = typeof req.body.boleta === 'string' ? req.body.boleta.trim() : '';

    if (!taller_id) {
        return res.status(400).json({ error: 'El taller es obligatorio' });
    }
    if (!usuario_id && !boletaTexto) {
        return res.status(400).json({ error: 'Indica un usuario o la boleta del alumno' });
    }
    if (boletaTexto && !validarBoleta(boletaTexto)) {
        return res.status(400).json({ error: 'Boleta inválida; debe contener 10 dígitos' });
    }

    try {
        const usuario = boletaTexto ? await usuariosModel.buscarPorBoleta(boletaTexto) : undefined;
        if (boletaTexto) {
            const existente = await asistenciasModel.buscarPorBoletaYTaller(boletaTexto, taller_id);
            if (existente) {
                return res.status(409).json({ error: 'El alumno ya está registrado en este taller' });
            }
        }
        if (!usuario_id && !usuario && !nombre_alumno) {
            return res.status(400).json({ error: 'El nombre del alumno es obligatorio para una boleta no registrada' });
        }

        const asistencia = await asistenciasModel.crear({
            usuario_id: usuario ? usuario.id : usuario_id,
            taller_id,
            nombre_alumno: usuario ? usuario.nombre : nombre_alumno,
            boleta: boletaTexto || null
        });
        res.status(201).json(asistencia);
    } catch (error) {
        if (esDuplicado(error)) {
            return res.status(409).json({ error: 'El alumno ya está registrado en este taller' });
        }
        res.status(500).json({ error: error.message });
    }
}

async function eliminarAsistencia(req, res) {
    try {
        const eliminada = await asistenciasModel.eliminar(req.params.id);
        if (!eliminada) return res.status(404).json({ error: 'Asistencia no encontrada' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    ListarAsistencias,
    ListarAsistenciasPorTaller,
    obtenerAsistencia,
    crearAsistencia,
    eliminarAsistencia
};