const express = require('express');
const cors = require('cors');

const app = express();

const eventosRoutes = require('./routes/eventos');

app.use(cors());
app.use(express.json());

// Registrar rutas
app.use('/api/eventos', eventosRoutes);

app.listen(3000, () => {
    console.log('Servidor funcionando... click here -> http://127.0.0.1:5500/frontend/index.html');
});
