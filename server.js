const helmet = require('helmet');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const express = require('express');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"]
        }
    },
    strictTransportSecurity: {
        maxAge: 300,
        includeSubDomains: false
    }
}));


// Permite recibir información en formato JSON.
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/*
// Ruta principal.
app.get('/', (req, res) => {
    res.send('Aplicación Lista de Tareas - Servidor funcionando');
});
*/

// Ruta para consultar las tareas almacenadas.
app.get('/api/tareas', async (req, res) => {
    try {
        const resultado = await pool.query(
            'SELECT * FROM tareas ORDER BY id'
        );

        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al consultar tareas:', error.message);
        res.status(500).json({
            error: 'No fue posible consultar las tareas'
        });
    }
});


 // Registrar una nueva tarea
app.post('/api/tareas', async (req, res) => {
    const { titulo, descripcion = '' } = req.body || {};

    if (typeof titulo !== 'string' || !titulo.trim()
        || titulo.length > 150
        || typeof descripcion !== 'string') {
        return res.status(400).json({
            error: 'Proporciona un título válido de hasta 150 caracteres.'
        });
    }

    try {
        const resultado = await pool.query(
            `INSERT INTO tareas (titulo, descripcion)
             VALUES ($1, $2) RETURNING *`,
            [titulo.trim(), descripcion]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al crear tarea:', error.message);
        res.status(500).json({ error: 'No se pudo crear la tarea.' });
    }
});

// Actualizar el estado de una tarea
app.patch('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { completada } = req.body || {};

    if (!Number.isSafeInteger(id) || id <= 0
        || typeof completada !== 'boolean') {
        return res.status(400).json({ error: 'Datos inválidos.' });
    }

    try {
        const resultado = await pool.query(
            `UPDATE tareas SET completada = $1
             WHERE id = $2 RETURNING *`,
            [completada, id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        res.json(resultado.rows[0]);
    } catch (error) {
        console.error('Error al actualizar tarea:', error.message);
        res.status(500).json({ error: 'No se pudo actualizar la tarea.' });
    }
});

// Eliminar una tarea
app.delete('/api/tareas/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Identificador inválido.' });
    }

    try {
        const resultado = await pool.query(
            'DELETE FROM tareas WHERE id = $1 RETURNING id',
            [id]
        );

        if (resultado.rowCount === 0) {
            return res.status(404).json({ error: 'Tarea no encontrada.' });
        }

        res.json({ mensaje: 'Tarea eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar tarea:', error.message);
        res.status(500).json({ error: 'No se pudo eliminar la tarea.' });
    }
});

/*
// Iniciar el servidor.
app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
*/


const HTTPS_PORT = 3443;
const HOST = '127.0.0.1';

// Cargar certificado y clave privada.
const opcionesHTTPS = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'cert.pem'))
};

// Iniciar servidor HTTPS.
https.createServer(opcionesHTTPS, app).listen(HTTPS_PORT, HOST, () => {
    console.log(`HTTPS: https://listatareas.test:${HTTPS_PORT}`);
});

// Redirigir las solicitudes HTTP hacia HTTPS.
http.createServer((req, res) => {
    res.writeHead(308, {
        Location: `https://listatareas.test:${HTTPS_PORT}${req.url}`
    });
    res.end();
}).listen(PORT, HOST, () => {
    console.log(`HTTP: http://listatareas.test:${PORT} (redirecciona a HTTPS)`);
});
