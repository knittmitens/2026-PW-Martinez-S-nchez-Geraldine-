const express = require('express');
const cors = require('cors');

const app = express ();
const PORT = 4000;

app.use(cors());
app.use(express.json());

//GET /saludo - responde con un mensaje
app.get('/saludo', (req, res) => {
    res.json({ mensaje: 'Hola desde el mini servidor express en puerto 4000'});
});

//POST /eco - devuelve el mismo texto que recibe
app.post('/eco', (req, res) => {
    const { texto } = req.body;
    if (!texto) {
        return res.status(400).json({ error: 'Falta el campo "texto" en el body'});
    }
    res.json({ eco: `Servidor recibio: ${texto}`});
});

app.Listen(PORT, () => {
    console.log(`Mini servidor Express corriendo en http:localhost:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  GET  http://localhost:${PORT}/saludo`);
    console.log(`  POST http://localhost:${PORT}/eco`);
});