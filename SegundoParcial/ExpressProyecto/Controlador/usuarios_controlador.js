const bcrypt = require('bcryptjs');
const usuariosModel = require('../Modelo/usuarios');
const { validarCorreo, validarBoleta, validarContrasena} = require('../validaciones');

//correo y boleta duplicados
function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function ListarUsuario(req, res) {
    try {
        const usuarios = await usuariosModel.listar();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function obtenerUsuario(req, res) {
    try {
        const usuario = await usuariosModel.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } 
}

async function crearUsuario(req, res) {
    const {nombre, correo, boleta, contrasena, rol} = req.body;
    if (!nombre || !correo || !boleta || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (!validarCorreo(correo)) return res.status(400).json({ error: 'Correo inválido' });
    if (!validarBoleta(boleta)) return res.status(400).json({ error: 'Boleta inválida' });
    if (!validarContrasena(contrasena)) return res.status(400).json({ error: 'Contraseña inválida' });
    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        const usuario = await usuariosModel.crear({nombre, correo, boleta, contrasenaHash, rol});

        res.status(201).json(usuario);
    } catch (error) {
        if (esDuplicado(error)) return res.status(409).json({ error: 'Correo o boleta ya registrado' });
        res.status(500).json({ error: error.message });
    }
}
async function actualizarUsuario(req, res) {
    const {nombre, correo, rol} = req.body;
    if (correo === undefined && nombre === undefined && rol === undefined) {
        return res.status(400).json({ error: 'Al menos un campo es obligatorio' });
    }
    if(correo !== undefined && !validarCorreo(correo)){
         return res.status(400).json({ error: 'Correo inválido' });
    }

try {
    const usuario = await usuariosModel.actualizar(req.params.id, {nombre, correo, rol});
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json(usuario);
} catch (error) {
    if (esDuplicado(error)) return res.status(409).json({ error: 'Correo ya registrado' });
    res.status(500).json({ error: error.message });
}
}

async function eliminarUsuario(req, res) {
    try {
        const eliminar = await usuariosModel.eliminar(req.params.id);
        if (!eliminar) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   
module.exports = { ListarUsuario, obtenerUsuario, crearUsuario, actualizarUsuario, eliminarUsuario };
