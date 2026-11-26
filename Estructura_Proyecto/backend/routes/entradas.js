
const express = require('express');
const router = express.Router();
const entradasQuerie = require('../queries/entradasQ');
const verificarToken = require('../servicios/auth');

// Obtener entradas de un evento
router.get('/evento/:idEvento', verificarToken, async (request, response) => {
    const idEvento = Number(request.params.idEvento);

    if (!Number.isInteger(idEvento) || idEvento <= 0) {
        return response.status(400).json({
            mensaje: 'El ID del Evento no es válido'
        });
    }

    try {
        const resultado = await entradasQuerie.obtenerEntradas(idEvento);
        response.json(resultado);
    } catch (error) {
        console.error('Error al obtener las entradas', error);
        response.status(500).json({
            mensaje: 'Error al obtener las entradas'
        });
    }
});

module.exports = router;


