(function() {
    var nombresTalleres = {
        1: "Introducción a Python",
        2: "Redes y Compus",
        3: "Analisis de Porque no me Alcanza para el Nuevo Zelda"
    };
    var parametros = new URLSearchParams(window.location.search);
    var taller = parametros.get("taller");
    var LinkVolver = document.querySelector("header a");
    if (taller && LinkVolver) {
        LinkVolver.href = "./detalle.html?taller=" + encodeURIComponent(taller);
    }
    if (taller && nombresTalleres[taller]) {
        var titulo = document.querySelector("main h1");
        var subtitulo = document.createElement("p");
        subtitulo.className = "taller-actual";
        subtitulo.textContent = "Taller: " + nombresTalleres[taller];
        titulo.insertAdjacentElement("afterend", subtitulo);
    }
})();

var form = document.getElementById("form-registro");
form.addEventListener("submit", function(evento) {
    evento.preventDefault();
    var nombre = document.getElementById("nombre");
    var boleta = document.getElementById("boleta");
    var fecha = document.getElementById("fecha");

    var errorNombre = document.getElementById("error-nombre");
    var errorBoleta = document.getElementById("error-boleta");
    var errorFecha = document.getElementById("error-fecha");
    var mensajeExito = document.getElementById("mensaje-exito");

    var formularioValido = true;


    //letras espacios menos vacio
    var expresionNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
    if (nombre.value.trim() === "" || !expresionNombre.test(nombre.value.trim())) {
        nombre.classList.add("input-invalido");
        errorNombre.textContent = "Por favor, ingresa un nombre válido (solo letras y espacios).";
        formularioValido = false;
    } else {
        nombre.classList.remove("input-invalido");
        errorNombre.textContent = "";
    }

    var expresionBoleta = /^[0-9]{10,11}$/;
    if (!expresionBoleta.test(boleta.value.trim())) {
        boleta.classList.add("input-invalido");
        errorBoleta.textContent = "Por favor, ingresa una boleta válida (solo números, 10 dígitos).";
        formularioValido = false;
    } else {
        boleta.classList.remove("input-invalido");
        errorBoleta.textContent = "";
    }

    var expresionFecha = /^[0-3][0-9]\/[0-1][0-9]\/[0-9]{4}$/;
    if (!expresionFecha.test(fecha.value.trim())) {
        fecha.classList.add("input-invalido");
        errorFecha.textContent = "Por favor, ingresa una fecha válida (formato: DD/MM/YYYY).";
        formularioValido = false;
    } else {
        fecha.classList.remove("input-invalido");
        errorFecha.textContent = "";
    }
    if (formularioValido === false){
        form.classList.add("registro-fallido");
        mensajeExito.classList.remove("exito");
        mensajeExito.textContent = "";

        setTimeout(function() {
            form.classList.remove("registro-fallido");
        }, 300);
    }else {
        form.classList.remove("registro-fallido");
        mensajeExito.textContent = "Registro exitoso!";
        mensajeExito.classList.add("exito");
        form.reset();
    }
});
