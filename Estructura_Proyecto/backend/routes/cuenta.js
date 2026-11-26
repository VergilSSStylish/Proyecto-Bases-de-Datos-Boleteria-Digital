const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/auth');
const cuentaQueries = require('../queries/cuentaQ');

// Solo existen visa y mastercar, tenemosq que poner mas XD
function detectarMarca(numero) {
    if (/^4/.test(numero)) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(numero)) return 'Mastercard';
    return null;
}

//GET | api de get cuenta perfil
router.get('/perfil', verificarToken, async (req, res) =>{
    try{
        const usuario =  await cuentaQueries.obtenerPerfil(req.usuarioId);
        if(!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(usuario);
    }catch (error) {
        console.error ('Error al obtener perfil', error);
        res.status(500).json({mensaje : 'Error al obtener el perfil'});
    }
});

// POST | /api/cuenta/logout
router.post('/logout', verificarToken, (req, res) => {
    // Con JWT el servidor no guarda sesión; el frontend borra el token
    res.json({ mensaje: 'Sesión cerrada' });
});

// GET /api/cuenta/metodos-pago
router.get('/metodos-pago', verificarToken, async (req, res) => {
    try{
        const tarjetas = await cuentaQueries.obtenerTarjetas(req.usuarioId);
        res.json(tarjetas);
    } catch (error){
        console.error('Errr al obtejer tarjetas: ', error);
        res.status(500).json({mensaje : 'Error al obtener los metodos de pago'})
    }
});


// POST /api/cuenta/metodos-pago ESTE ESTA BIEN FEO, hay que entenderle bien para la defensa

router.post('/metodos-pago', verificarToken, async (req, res) => {
    try {
        const { titular, numero, expiracion } = req.body; 
        // el CVV no se recibe

        //todos estos if son solo verifiaciones al momento que el usuario ingrese datos 
        if (!titular || !numero || !expiracion) {
            return res.status(400).json({ mensaje: 'Faltan datos' });
        }

        const numeroLimpio = String(numero).replace(/\s/g, '');
        if (!/^\d{13,19}$/.test(numeroLimpio)) {
            return res.status(400).json({ mensaje: 'Número de tarjeta inválido' });
        }

        const match = /^(\d{2})\/(\d{2})$/.exec(expiracion);
        if (!match) {
            return res.status(400).json({ mensaje: 'Expiración inválida (MM/AA)' });
        }
        const mes = parseInt(match[1], 10);
        const anio = 2000 + parseInt(match[2], 10);
        if (mes < 1 || mes > 12) {
            return res.status(400).json({ mensaje: 'Mes inválido' });
        }
        const hoy = new Date();
        if (anio < hoy.getFullYear() || (anio === hoy.getFullYear() && mes < hoy.getMonth() + 1)) {
            return res.status(400).json({ mensaje: 'La tarjeta está vencida' });
        }

        const marca = detectarMarca(numeroLimpio);
        if (!marca) {
            return res.status(400).json({ mensaje: 'Solo se aceptan tarjetas Visa o Mastercard' });
        }
        const idTipo = await cuentaQueries.obtenerIdTipoTarjeta(marca);
        if (!idTipo) {
            return res.status(400).json({ mensaje: 'Tipo de tarjeta no soportado' });
        }
        //  aqui terminan las condiciones

        // La BD guarda DATE: usamos el último día del mes de expiración
        const ultimoDia = new Date(anio, mes, 0).getDate();
        const fechaExp = `${anio}-${String(mes).padStart(2, '0')}-${String(ultimoDia).padStart(2, '0')}`;

        // Solo se guarda enmascarado: ************4444
        const ultimos4 = numeroLimpio.slice(-4);
        const panEnmascarado = '*'.repeat(numeroLimpio.length - 4) + ultimos4;

        const id = await cuentaQueries.agregarTarjeta(
            req.usuarioId, titular.trim(), panEnmascarado, fechaExp, idTipo
        );

        res.status(201).json({
            IDTarjeta: id,
            Titular: titular.trim(),
            Marca: marca,
            Ultimos4: ultimos4,
            MesExp: mes,
            AnioExp: anio
        });
    } catch (error) {
        console.error('Error al agregar tarjeta:', error);
        res.status(500).json({ mensaje: 'Error al agregar el método de pago' });
    }
});

// DELETE /api/cuenta/metodos-pago/:id
router.delete('/metodos-pago/:id', verificarToken, async (req, res) =>{
    try{
        const filas = await cuentaQueries.eliminarTarjeta(req.params.id, req.usuarioId);
        if (filas == 0){
           return res.status(404).json({ mensaje: 'Método de pago no encontrado' });
        }
       res.json({ mensaje: 'Método de pago eliminado' });
    } catch (error) {
        if(error.code === 'ER_ROW_IS_REFERENCED_2'){
            return res.status(409).json({ mensaje: 'No se puede eliminar: la tarjeta tiene pagos asociados'});
        }
        console.error('Error al eliminar tarjeta', error);
        res.status(500).json({ mensaje: 'Error al eliminar el método de pago' });    
    }
});

module.exports = router;
