

const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];


function pintarTabla(){
    //debe de obtener la tabla y rellenarla con los datos de talleres

    const cuerpoTabla = document.querySelector('#tabla-talleres tbody');
    cuerpoTabla.innerHTML = '';
    talleres.forEach((t) => {
        cuerpoTabla.innerHTML += `
        <tr>
            <td>${t.nombre}</td>
            <td>${t.instructor}</td>
            <td>${t.cupo}</td>
            <td>${t.inscritos}</td>
        </tr>
        `;
    });
}

const formArreglos = document.getElementById('form-arreglos');

const resultadoArreglos = document.getElementById('resultado-arreglo');

const selectOperacionArreglo = document.getElementById('operacion-arreglo');

formArreglos.addEventListener('submit', (evento) =>{
    evento.preventDefault();
    const operacion = selectOperacionArreglo.value;

    let resultado;

    switch(operacion){
        case 'forEach':
            resultado = talleres.map((t) => `- ${t.nombre} (${t.inscritos}/${t.cupo})`).join('\n');
            break;

        case 'map':
            resultado = talleres.map((t) => t.nombre).join('\n');
            break;
        case 'filter':
            resultado = talleres.filter((t) => t.inscritos >= t.cupo).map((t) => t.nombre).join('\n');
            break;
        case 'find': {
            const tallerMaria = talleres.find((t) => t.instructor === 'Ing. María López');
            resultado = tallerMaria ? tallerMaria.nombre : 'No encontrado';
            break;
        }
        case 'reduce': {
            const totalInscritos = talleres.reduce((total, t) => total + t.inscritos, 0);
            resultado = `Total de inscritos: ${totalInscritos}`;
            break;
    }
        case 'disponibles':
           resusltado = talleres.filter((t) => t.inscritos < t.cupo).map((t) => t.nombre).join('\n');
            break;
}


    resultadoArreglos.textContent = resultado;
});

pintarTabla();