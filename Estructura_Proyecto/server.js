const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const express = require('express');
const cors = require('cors');

const app = express();

const eventosRoutes = require('./backend/routes/eventos');
const entradasRoutes = require('./backend/routes/entradas');
const detalleeventoRoutes = require('./backend/routes/detalleevento');
const cuentaRoutes = require('./backend/routes/cuenta');

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'pantallas')));

// Registrar rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/entradas',  entradasRoutes);
app.use('/api/detalleevento', detalleeventoRoutes);
app.use('/api/cuenta', cuentaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
