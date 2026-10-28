const talleresModel = require('../Modelo/talleres');

//consulta talleres
async function ListarTalleres(req, res) {
    try {
        const talleres = await talleresModel.listar();
        res.json(talleres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

//consulta taller por id
async function obtenerTaller(req, res) {
    try {
        const taller = await talleresModel.obtenerPorId(req.params.id);
        if (!taller) return res.status(404).json({ error: 'El taller no fue encontrado' });
        res.json(taller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//registrar taller
async function crearTaller(req, res) {
    const {nombre, descripcion, instructor, fecha, cupo} = req.body;
    if(!nombre || !fecha){
        return res.status(400).json({ error: 'El nombre y fecha son obligatorios' });
    }
    try {
        const taller = await talleresModel.crear({nombre, descripcion, instructor, fecha, cupo});
        res.status(201).json(taller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//actualizar taller
async function actualizarTaller(req, res) {
    const {nombre, descripcion, instructor, fecha, cupo} = req.body;
    try {
        const taller = await talleresModel.actualizar(req.params.id, {nombre, descripcion, instructor, fecha, cupo});
        if (!taller) return res.status(404).json({ error: 'El taller no fue encontrado' });
        res.json(taller);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}
//eliminar taller
async function eliminarTaller(req, res) {
    try {
        const eliminar = await talleresModel.eliminar(req.params.id);
        if (!eliminar) return res.status(404).json({ error: 'El taller no fue encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { ListarTalleres, obtenerTaller, crearTaller, actualizarTaller, eliminarTaller };