// funciones para validar correo, boleta y contraseña
//correo
function validarCorreo(correo){
    if (typeof correo !== 'string') return false;
    const texto = correo.trim();
    const partes = texto.split('@');
    if (texto.length > 100 || /\s/u.test(texto) || partes.length !== 2) return false;

    const [local, dominio] = partes;
    const patronLocal = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
    const patronDominio = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    return local.length <= 64
        && patronLocal.test(local)
        && !local.startsWith('.')
        && !local.endsWith('.')
        && !local.includes('..')
        && dominio.length <= 253
        && patronDominio.test(dominio);
}

// boleta
function validarBoleta(boleta) {
    if (typeof boleta !== 'string') return false;
const patronBoleta = /^\d{10}$/;
return patronBoleta.test(boleta.trim());
}

//contraseña 
function validarContrasena(contrasena) {
    if (typeof contrasena !== 'string') return false;
    return contrasena.length >= 8;
}

module.exports = {validarCorreo, validarBoleta, validarContrasena};