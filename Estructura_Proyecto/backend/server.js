const express = require('express');
const cors = require('cors');

const app = express();

const eventosRoutes = require('./routes/eventos');
const entradasRoutes = require('./routes/entradas');



app.use(cors());
app.use(express.json());

// Registrar rutas
app.use('/api/eventos', eventosRoutes);
app.use('/api/entradas',  entradasRoutes);

app.listen(3000, () => {
    console.log('Servidor funcionando... click aqui -> http://localhost:5500/Estructura_Proyecto/frontend/index.html');
});
