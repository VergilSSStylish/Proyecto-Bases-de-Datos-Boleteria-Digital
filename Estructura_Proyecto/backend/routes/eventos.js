
const express = require('express');
const router = express.Router();
const eventosQueries = require('../queries/eventosQ');

router.get('/', async (req, res) => {
    try {
        const resultado = await eventosQueries.obtenerEventos();
        const eventosAgrupados = {};
        resultado.forEach(fila => {
            const id = fila.IDEvento;
            if (!eventosAgrupados[id]) {
//Importante esta condición comprueba si el evento ya existe en el objeto
//si no existe, lo crea y si ya existe, no vuelve a crear otro evento.
                eventosAgrupados[id] = {
                    IDEvento: fila.IDEvento,
                    Titulo: fila.Titulo,
                    Descripcion: fila.Descripcion,
                    Fecha: fila.Fecha,
                    HoraInicio: fila.HoraInicio,
                    HoraFin: fila.HoraFin,
                    RestriccionXEdad: fila.RestriccionXEdad,
                    RutaImagen: fila.RutaImagen,
                    IDRecinto: fila.IDRecinto,
                    NombreRecinto: fila.NombreRecinto,
                    Colonia: fila.Colonia,
                    Calle: fila.Calle,
                    Municipio: fila.Municipio,
                    Departamento: fila.Departamento,
                    Categorias: []
                };
            }
            if (
// Agrega las categorias al mismo evento 
                fila.Categoria &&
                !eventosAgrupados[id].Categorias.includes(fila.Categoria)
            ) {
                eventosAgrupados[id].Categorias.push(fila.Categoria);
            }
        });
        res.json(Object.values(eventosAgrupados));
    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({
            mensaje: 'Error al obtener los eventos'
        });
    }
});
module.exports = router;

router.get('/categorias', async (req, res) => {
    try {
        const resultado = await eventosQueries.obtenerCategorias();
        res.json(resultado);
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        res.status(500).json({
            mensaje: 'Error al obtener las categorías'
        });
    }
});