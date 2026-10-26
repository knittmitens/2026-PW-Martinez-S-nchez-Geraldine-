const express = require('express');

const app = express();

app.use(express.json());

const PORT = 4000;

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

app.listen(PORT, () => {
    console.log(`Mini servidor express en http://localhost:${PORT}`);
    console.log(`   GET http://localhost:${PORT}/saludo`);
    console.log(`   POST http://localhost:${PORT}/eco`);

});