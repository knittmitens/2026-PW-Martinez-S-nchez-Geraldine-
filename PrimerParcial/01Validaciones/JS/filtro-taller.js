(function() {
    var params = new URLSearchParams(window.location.search);
    var tallerSeleccionado = parametros.get("taller");
    if (!tallerSeleccionado) {
        return;
    }
    var tarjetas = document.querySelectorAll(".info-taller .tarjeta");
    tarjetas.forEach(function(tarjeta) {
        if (tarjeta.getAtttribute("data-taller") === tallerSeleccionado) {
            tarjeta.classList.add("activo");
        } else {
            tarjeta.style.display = "none";
        }
        });
    })();