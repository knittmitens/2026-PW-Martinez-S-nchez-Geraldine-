const bcrypt = require('bcryptjs');
const usuariosModel = require('../Modelo/usuarios');
const { validarCorreo, validarBoleta } = require('../validaciones');

function camposString(req, nombres) {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return undefined;
    const campos = {};
    for (const nombre of nombres) {
        if (typeof req.body[nombre] !== 'string') return undefined;
        campos[nombre] = req.body[nombre].trim();
    }
    return campos;
}

function validarNombre(nombre) {
    if (nombre.length < 3
        || nombre.length > 100
        || !/^(?=.*\p{L})[\p{L}\p{M} ]+$/u.test(nombre)) {
        return false;
    }

    const palabras = nombre.trim().split(/\s+/u);
    const vecesPorPalabra = new Map();
    for (const palabra of palabras) {
        const normalizada = palabra.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
        const veces = (vecesPorPalabra.get(normalizada) || 0) + 1;
        if (veces > 2) return false;
        vecesPorPalabra.set(normalizada, veces);
    }
    return true;
}

function validarContrasena(contrasena) {
    return contrasena.length >= 8
        && contrasena.length <= 64
        && !/\s/u.test(contrasena)
        && !/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{20E3}\u{E0020}-\u{E007F}]/u.test(contrasena);
}

//correo y boleta duplicados
function esDuplicado(error) {
    return error.code === 'ER_DUP_ENTRY' || error.code === '23505';
}

async function ListarUsuarios(req, res) {
    try {
        const usuarios = await usuariosModel.listarUsuarios();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function obtenerUsuario(req, res) {
    try {
        const usuario = await usuariosModel.obtenerPorId(req.params.id);
        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    } 
}

async function crearUsuario(req, res) {
    const campos = camposString(req, ['nombre', 'correo', 'contrasena', 'boleta']);
    if (!campos) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const { nombre, correo, contrasena, boleta } = campos;
    if (!validarNombre(nombre)) {
        return res.status(400).json({ error: 'El nombre debe tener entre 3 y 100 letras y espacios, sin repetir una palabra más de dos veces' });
    }
    if (!validarCorreo(correo)) {
        return res.status(400).json({ error: 'Correo inválido; debe tener máximo 100 caracteres' });
    }
    if (!validarContrasena(contrasena)) {
        return res.status(400).json({ error: 'La contraseña debe tener entre 8 y 64 caracteres, sin espacios ni emojis' });
    }
    if (!validarBoleta(boleta)) {
        return res.status(400).json({ error: 'Boleta inválida; debe contener exactamente 10 dígitos' });
    }
    try {
        const contrasenaHash = await bcrypt.hash(contrasena, 10);
        await usuariosModel.crearUsuario(nombre, correo, contrasenaHash, boleta);
        res.status(201).json({ mensaje: 'Usuario creado correctamente.' });
    } catch (error) {
        if (esDuplicado(error)) return res.status(409).json({ error: 'Correo o boleta ya registrado' });
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

async function obtenerPorBoleta(req, res) {
    const boleta = typeof req.params.boleta === 'string' ? req.params.boleta.trim() : '';
    if (!validarBoleta(boleta)) {
        return res.status(400).json({ error: 'Boleta inválida; debe contener exactamente 10 dígitos' });
    }
    try {
        const usuario = await usuariosModel.obtenerPorBoleta(boleta);
        if (!usuario) return res.status(404).json({ error: 'No existe un usuario con esa boleta' });
        res.json({
            id: usuario.id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            boleta: usuario.boleta,
            rol: usuario.rol
        });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
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
    res.status(500).json({ error: 'Error interno del servidor' });
}
}

async function eliminarUsuario(req, res) {
    try {
        const eliminar = await usuariosModel.eliminar(req.params.id);
        if (!eliminar) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}   
module.exports = {
    ListarUsuarios,
    ListarUsuario: ListarUsuarios,
    obtenerUsuario,
    crearUsuario,
    obtenerPorBoleta,
    actualizarUsuario,
    eliminarUsuario
};
