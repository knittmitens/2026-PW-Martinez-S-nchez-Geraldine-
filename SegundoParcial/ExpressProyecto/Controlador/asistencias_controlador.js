const asistenciasModel = require('../Modelo/asistencias');
//consulta asistencias
async function ListarAsistencias(req, res) {
    try {
        const asistencias = await asistenciasModel.listar();
        res.json(asistencias);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

//consulta asistencia por id
async function obtenerAsistencia(req, res) {
    try {
        const asistencia = await asistenciasModel.obtenerPorId(req.params.id);
        if (!asistencia) return res.status(404).json({ error: 'Asistencia no encontrada' }); 
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
}
// asistencia en taller
async function crearAsistencia(req, res) {
    const {usuario_id, taller_id} = req.body;
    if (!usuario_id || !taller_id) {
        return res.status(400).json({ error: 'El usuario y taller son obligatorios' });
    }
    try {
     const asistencia = await asistenciasModel.crear(usuario_id, taller_id);
        res.status(201).json(asistencia);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}