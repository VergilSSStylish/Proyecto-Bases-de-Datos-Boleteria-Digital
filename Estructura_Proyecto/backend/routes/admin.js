
const express = require('express');
const router = express.Router();

const verificarToken = require('../servicios/auth');
const adminQ = require('../queries/adminQ');

//obtiene informacion del dashboard del administrador
router.get('/dashboard', verificarToken, async (req, res) => {
    try {
        // Comprueba que el usuario sea administrador
        const administrador = await adminQ.obtenerAdministrador(req.usuarioId);
        if (!administrador) {
            return res.status(403).json({
                exitoso: false,
                mensaje: 'No tienes permisos para acceder al dashboard.'
            });
        }

        // Obtener las estadísticas del dashboard
        const [
            ingresos,
            boletos,
            eventos,
            clientes,
            proximosEventos,
            ingresosPorEvento,
            ocupacionPorZona,
            eventosMasVendidos
        ] = await Promise.all([
            adminQ.obtenerIngresos(),
            adminQ.obtenerBoletosVendidos(),
            adminQ.obtenerEventosActivos(),
            adminQ.obtenerClientes(),
            adminQ.obtenerProximosEventos(),
            adminQ.obtenerIngresosPorEvento(),
            adminQ.obtenerOcupacionPorZona(),
            adminQ.obtenerEventosMasVendidos()
        ]);

        res.json({
            exitoso: true,
            administrador,
            estadisticas: {
                ingresos,
                boletos,
                eventos,
                clientes
            },
            proximosEventos,
            graficos: {
                ingresosPorEvento,
                ocupacionPorZona,
                eventosMasVendidos
            }
        });

    } catch (error) {
        console.error('Error al cargar dashboard del administrador:', error);

        res.status(500).json({
            exitoso: false,
            mensaje: 'Error al obtener la información del dashboard.'
        });
    }
});

module.exports = router;
