const conexion = require('../config/conexion');

const obtenerDetalleEvento = async (idEvento) => {
    const [resultado] = await conexion.query(`
        SELECT IDEvento,
                RestriccionXEdad,
               codVestimenta,
               PermiteAcompanante,
               MaxAcompanantes
        FROM Evento
        WHERE IDEvento = ?
            AND Estado = 1
    `, [idEvento]);

    return resultado[0];
};

module.exports = { obtenerDetalleEvento };
