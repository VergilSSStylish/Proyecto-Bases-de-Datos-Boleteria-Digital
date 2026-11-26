
const express = require('express');
const router = express.Router();
const detalleeventoQueries = require('../queries/detalleeventoQ');

router.get('/:id', async (req, res) => {
    const idEvento = Number(req.params.id);

    if (!Number.isInteger(idEvento) || idEvento <= 0) {
        return res.status(400).json({
            mensaje: 'ID de evento inválido'
        });
    }

    try {
        const evento = await detalleeventoQueries.obtenerDetalleEvento(idEvento);

        if (!evento) {
            return res.status(404).json({
                mensaje: 'Evento no encontrado'
            });
        }

        res.json(evento);

    } catch (error) {
        console.error('Error al obtener el detalle del evento:', error);

        res.status(500).json({
            mensaje: 'Error al obtener el detalle del evento'
        });
    }
});

module.exports = router;
