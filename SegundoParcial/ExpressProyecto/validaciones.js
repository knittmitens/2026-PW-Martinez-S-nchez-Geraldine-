// funciones para validar correo, boleta y contraseña
//correo
function validarCorreo(correo){
    if (typeof correo !== 'string')return false;
    const patronCorreo = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return  patronCorreo.test(correo.trim());
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