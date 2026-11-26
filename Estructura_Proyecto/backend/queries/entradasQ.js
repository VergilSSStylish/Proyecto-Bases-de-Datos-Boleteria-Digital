const conexion = require ('../config/conexion');

const obtenerEntradas = async (idEvento) => {
    const [resultado] = await conexion.query(`SELECT 
    EZP.IDZonaPrecio, ZR.NombreZona, ZR.Detalles, EZP.CupoDisponible, EZP.Precio 
    FROM evento E
    INNER JOIN EventoxZonaprecio EZP  on E.idEvento = EZP.idEvento
    INNER JOIN zonasrecinto ZR ON EZP.IDZonasRecinto = ZR.IDZonasRecinto 
    WHERE E.IDEvento = ?
    AND E.Estado = 1
    AND ZR.Estado = 1
    ORDER BY ezp.precio`
        , [idEvento]);
        return resultado;
};

module.exports = {obtenerEntradas}