//recie las peticiones y las manda a donde toque

const express = require('express');
const asistenciasControlador = require('./Controlador/asistencias_controlador');
const talleresControlador = require('./Controlador/talleres_controlador');
const usuariosControlador = require('./Controlador/usuarios_controlador');

const app = express();

app.use(express.json());

const PORT = 4000;

app.get('/api/talleres', talleresControlador.ListarTalleres);
app.get('/api/talleres/:id', talleresControlador.obtenerTaller);

// Alias para consultar las asistencias de un taller
app.get('/api/talleres/:id/asistencias', (req, res) => {
    req.params.taller_id = req.params.id;
    asistenciasControlador.ListarAsistenciasPorTaller(req, res);
});

app.get('/api/asistencias', asistenciasControlador.ListarAsistencias);
app.get('/api/asistencias/:id', asistenciasControlador.obtenerAsistencia);
app.post('/api/asistencias', asistenciasControlador.crearAsistencia);

app.get('/api/usuarios', usuariosControlador.ListarUsuario);
app.get('/api/usuarios/:id', usuariosControlador.obtenerUsuario);

//ruta principal por metodo get
app.get('/saludo', (req, res) => {
    res.json({ mensaje: 'Hola desde el mini server' });
});

//Post /eco devuelve el texto q recibe
app.post('/eco', (req, res) => {
    const { texto } = req.body;
    if (!texto) {
        return res.status(400).json({ error: 'Falta el campo "texto" en el bodyy jeje' });
    }
    res.status(201).json({ eco:texto })
});

app.get('/', (req, res) => {
    res.json({ mensaje: 'API de reegistro de asistencia - CECyT 9 funcionando correctamente' });
});

app.listen(PORT, () => {
    console.log(`Mini servidor express en http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/saludo`);
    console.log(`   POST http://localhost:${PORT}/eco`);

});