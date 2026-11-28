
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');

const app = express();

const eventosRoutes = require('./backend/routes/eventos.js');
const entradasRoutes = require('./backend/routes/entradas.js');
const detalleeventoRoutes = require('./backend/routes/detalleevento.js');
const usuariosRoutes = require('./backend/routes/usuarios.js');
const cuentasRoutes = require('./backend/routes/cuenta.js');
const ticketsRoutes = require('./backend/routes/tickets.js');

app.use(cors({
    origin: [
        'http://127.0.0.1:5500',
        'http://127.0.0.1:5501',
        'http://localhost:5500',
        'http://localhost:5501'
    ],
    credentials: true
}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'pantallas')));

// Registrar rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/entradas',  entradasRoutes);
app.use('/api/detalleevento', detalleeventoRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/cuenta', cuentasRoutes);
app.use('/api/tickets', ticketsRoutes);

const PORT = 3000;

const servidor = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Servidor funcionando en http://127.0.0.1:${PORT}`);
});

servidor.on('close', () => {
    console.log('El servidor se ha cerrado');
});

servidor.on('error', (error) => {
    console.error('Error del servidor:', error);
});
