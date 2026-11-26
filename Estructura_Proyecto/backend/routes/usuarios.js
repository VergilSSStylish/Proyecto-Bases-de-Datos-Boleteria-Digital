const express = require('express');
const router = express.Router();
const { firmarToken } = require('../utils/jwt');
const { iniciarSesion } = require('../servicios/login');
const { registrarUsuario } = require('../servicios/registro');
const DESTINOS = require('../servicios/destinos');



router.post('/login', async (req, res) => {
    try {
        const { correo, contrasena, recordarme } = req.body;
        if (!correo || !contrasena) {
            return res.status(400).json({
                exitoso: false,
                mensaje: 'Ingrese su correo y contraseña.'
            });
        }
        const resultado = await iniciarSesion(correo, contrasena);
        if (!resultado.exitoso) {
            return res.status(401).json(resultado);
        }
        const destino = DESTINOS[resultado.usuario.tipo];
        if (!destino) {
            return res.status(400).json({
                exitoso: false,
                mensaje: 'No se encontró una página para este tipo de usuario.'
            });
        }
        // Generar token JWT
        const tiempoExpiracion = recordarme
            ? 30 * 24 * 60 * 60
            : 60 * 60;
        const token = firmarToken(
            {
                id: resultado.usuario.id,
                tipo: resultado.usuario.tipo
            },
            tiempoExpiracion
        );
        res.json({
            exitoso: true,
            token,
            usuario: resultado.usuario,
            destino
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({
            exitoso: false,
            mensaje: 'Error al iniciar sesión.'
        });
    }
});



router.post('/registro', async (req, res) => {
    try {
        const resultado = await registrarUsuario(req.body);
        if (!resultado.exitoso) {
            return res.status(400).json(resultado);
        }
        res.status(201).json(resultado);
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                exitoso: false,
                mensaje: 'El correo, teléfono o RTN ya está registrado.'
            });
        }
        res.status(500).json({
            exitoso: false,
            mensaje: 'Error al crear la cuenta.'
        });
    }
});

router.post('/logout', (req, res) => {
   
    res.json({
        exitoso: true,
        mensaje: 'Sesión cerrada correctamente.'
    });
});

module.exports = router;