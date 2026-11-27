
const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');

const verificarToken = require('../servicios/auth');
const {
    obtenerTicketsUsuario,
    obtenerCodigoActivo,
    obtenerBoletosDevolvibles,
    registrarDevoluciones
} = require('../queries/ticketsQ');
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

// QR de un boleto propio y activo
router.get('/:id/qr', verificarToken, async (req, res) => {
    try {
        const boleto = await obtenerCodigoActivo(req.usuarioId, req.params.id);
        if (!boleto) {
            return res.status(404).json({ exitoso: false, mensaje: 'Boleto no disponible.' });
        }
        res.json({ exitoso: true, qr: await QRCode.toDataURL(boleto.CodigoAlfanumerico) });
    } catch (error) {
        console.error('Error al generar QR:', error);
        res.status(500).json({ exitoso: false, mensaje: 'Error al generar el QR.' });
    }
});

// Solicitar la devolución de un boleto (si es titular, también la de sus acompañantes)
router.post('/devoluciones', verificarToken, async (req, res) => {
    try {
        const { idBoleto, motivo } = req.body;
        // La vista decide si procede: boleto propio, activo, 48 h o más y sin solicitud previa
        const boletos = await obtenerBoletosDevolvibles(req.usuarioId, idBoleto);
        if (!boletos.some(b => b.IDBoleto == idBoleto)) {
            return res.status(400).json({ exitoso: false, mensaje: 'Este boleto no se puede devolver.' });
        }
        await registrarDevoluciones(boletos, motivo);
        res.status(201).json({ exitoso: true, devueltos: boletos.length });
    } catch (error) {
        // Errores que detectan las restricciones de la tabla Devoluciones
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ exitoso: false, mensaje: 'Ya existe una solicitud de devolución para este boleto.' });
        }
        if (['ER_CHECK_CONSTRAINT_VIOLATED', 'ER_BAD_NULL_ERROR'].includes(error.code)) {
            return res.status(400).json({ exitoso: false, mensaje: 'Escriba el motivo de la devolución.' });
        }
        console.error('Error en devolución:', error);
        res.status(500).json({ exitoso: false, mensaje: 'Error al registrar la devolución.' });
    }
});

module.exports = router;
