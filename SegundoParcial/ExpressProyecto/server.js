//recie las peticiones y las manda a donde toque

const express = require('express');
const cors = require('cors');
const asistenciasControlador = require('./Controlador/asistencias_controlador');
const talleresControlador = require('./Controlador/talleres_controlador');
const usuariosControlador = require('./Controlador/usuarios_controlador');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10kb' }));

const PORT = process.env.PORT || 4000;

app.get('/api/talleres', talleresControlador.ListarTalleres);
app.get('/api/talleres/:id', talleresControlador.obtenerTaller);
app.post('/api/talleres', talleresControlador.crearTaller);
app.put('/api/talleres/:id', talleresControlador.actualizarTaller);
app.delete('/api/talleres/:id', talleresControlador.eliminarTaller);

// Alias para consultar las asistencias de un taller
app.get('/api/talleres/:id/asistencias', (req, res) => {
    req.params.taller_id = req.params.id;
    asistenciasControlador.ListarAsistenciasPorTaller(req, res);
});

app.get('/api/asistencias', asistenciasControlador.ListarAsistencias);
app.get('/api/asistencias/:id', asistenciasControlador.obtenerAsistencia);
app.post('/api/asistencias', asistenciasControlador.crearAsistencia);
app.delete('/api/asistencias/:id', asistenciasControlador.eliminarAsistencia);

app.get('/api/usuarios', usuariosControlador.ListarUsuarios);
app.get('/api/usuarios/boleta/:boleta', usuariosControlador.obtenerPorBoleta);
app.get('/api/usuarios/:id', usuariosControlador.obtenerUsuario);
app.post('/api/usuarios', usuariosControlador.crearUsuario);
app.put('/api/usuarios/:id', usuariosControlador.actualizarUsuario);
app.delete('/api/usuarios/:id', usuariosControlador.eliminarUsuario);

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

app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    if (error.type === 'entity.parse.failed' || error.type === 'entity.too.large') {
        return res.status(400).json({ error: 'El JSON enviado es inválido o demasiado grande' });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
    console.log(`Mini servidor express en http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/saludo`);
    console.log(`   POST http://localhost:${PORT}/eco`);

});