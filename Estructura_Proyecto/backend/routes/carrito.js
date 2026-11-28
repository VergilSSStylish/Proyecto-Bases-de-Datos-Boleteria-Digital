const express = require('express');
const router = express.Router();
const verificarToken = require('../servicios/auth');
const carritoQ = require('../queries/carritoQ');

router.get('/', verificarToken, async (req, res) => {
    try {
        const datos = await carritoQ.obtenerCarritoUsuario(req.usuarioId);
        res.json(datos);
    } catch (error) {
        console.error('Error al obtener carrito:', error);
        res.status(500).json({ mensaje: 'Error al cargar el carrito' });
    }
});

router.post('/reservar', verificarToken, async (req, res) => {
    try {
        const { idEvento, items } = req.body;
        if (!idEvento || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ mensaje: 'No se seleccionaron entradas válidas.' });
        }

        const idCarrito = await carritoQ.reservarEntradas(req.usuarioId, Number(idEvento), items);
        res.status(201).json({ mensaje: 'Entradas reservadas temporalmente', idCarrito });
    } catch (error) {
        console.error('Error al reservar entradas:', error);
        res.status(400).json({ mensaje: error.message || 'No se pudieron reservar las entradas.' });
    }
});

router.delete('/item/:idZonaPrecio', verificarToken, async (req, res) => {
    try {
        const idZonaPrecio = Number(req.params.idZonaPrecio);
        if (!Number.isInteger(idZonaPrecio) || idZonaPrecio <= 0) {
            return res.status(400).json({ mensaje: 'ID de localidad inválido.' });
        }

        await carritoQ.eliminarLocalidadCarrito(req.usuarioId, idZonaPrecio);
        res.json({ mensaje: 'Entrada eliminada del carrito' });
    } catch (error) {
        console.error('Error al eliminar ítem del carrito:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la entrada del carrito' });
    }
});

router.post('/confirmar', verificarToken, async (req, res) => {
    try {
        const { idTipoDescuento, idTarjeta } = req.body;
        const resultado = await carritoQ.confirmarCompra(
            req.usuarioId,
            idTipoDescuento ? Number(idTipoDescuento) : 1,
            idTarjeta ? Number(idTarjeta) : null
        );
        res.status(201).json({
            mensaje: '¡Compra realizada con éxito!',
            ...resultado
        });
    } catch (error) {
        console.error('Error al confirmar compra:', error);
        res.status(400).json({ mensaje: error.message || 'No se pudo completar la compra.' });
    }
});

module.exports = router;