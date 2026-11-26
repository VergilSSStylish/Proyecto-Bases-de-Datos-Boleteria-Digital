
const express = require('express');
const router = express.Router();

const verificarToken = require('../servicios/auth');
const { obtenerTicketsUsuario } = require('../queries/ticketsQ');
// obtener los tickets del usuario que inicio sesion
router.get('/', verificarToken, async (req, res) => {
    try {
        const tickets = await obtenerTicketsUsuario(req.usuarioId);

        res.json({
            exitoso: true,
            tickets
        });
    } catch (error) {
        console.error('Error al obtener tickets:', error);

        res.status(500).json({
            exitoso: false,
            mensaje: 'Error al obtener los tickets'
        });
    }
});
module.exports = router;
