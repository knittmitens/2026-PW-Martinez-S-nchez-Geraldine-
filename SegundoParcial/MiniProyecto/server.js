const express = require('express');
const cors = require('cors');

const app = express();
const DEFAULT_PORT = 4000;
const PORT = Number(process.env.PORT) || DEFAULT_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/plain' }));

//GET /saludo - responde con un mensaje
app.get('/saludo', (req, res) => {
    res.json({ mensaje: `Hola desde el mini servidor express en puerto ${PORT}` });
});

//POST /eco - devuelve el mismo texto que recibe
app.post('/eco', (req, res) => {
    const texto = typeof req.body === 'string'
        ? req.body
        : req.body?.texto ?? req.body?.mensaje ?? req.body?.message ?? '';

    if (!texto || !String(texto).trim()) {
        return res.status(400).json({ error: 'Falta el campo "texto" en el body' });
    }

    res.json({ eco: `Servidor recibio: ${texto}` });
});

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Mini servidor Express corriendo en http://localhost:${port}`);
        console.log('Endpoints:');
        console.log(`  GET  http://localhost:${port}/saludo`);
        console.log(`  POST http://localhost:${port}/eco`);
    });

    server.on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            const nextPort = port + 1;
            console.warn(`Puerto ${port} ocupado. Intentando ${nextPort}...`);
            startServer(nextPort);
            return;
        }

        throw error;
    });
};

startServer(PORT);