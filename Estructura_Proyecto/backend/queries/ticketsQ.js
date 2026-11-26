const conexion = require('../config/conexion');
const obtenerTicketsUsuario = async (idUsuario) => {//necesario crear una vista para solo consultar
    const [resultado] = await conexion.query(`
        SELECT
            o.IDOrden,
            o.FechaCompra,
            eo.Nombre AS EstadoOrden,
            b.IDBoleto,
            b.CodigoAlfanumerico,
            eb.NombreEstado AS EstadoBoleto,
            e.Titulo AS Evento,
            e.Fecha AS FechaEvento,
            e.HoraInicio,
            r.NombreRecinto,
            zr.NombreZona,
            ezp.Precio
        FROM orden o
        INNER JOIN detalleorden do
            ON o.IDOrden = do.IDOrden
        INNER JOIN boletos b
            ON do.IDBoleto = b.IDBoleto
        INNER JOIN evento e
            ON b.IDEvento = e.IDEvento
        LEFT JOIN estadoorden eo
            ON o.IDEstadoOrden = eo.IDEstadoOrden
        LEFT JOIN estadoboleto eb
            ON b.IDEstadoBoleto = eb.IDEstadoBoleto
        LEFT JOIN eventoxzonaprecio ezp
            ON b.IDZonaPrecio = ezp.IDZonaPrecio
        LEFT JOIN zonasrecinto zr
            ON ezp.IDZonasRecinto = zr.IDZonasRecinto
        LEFT JOIN recinto r
            ON e.IDRecinto = r.IDRecinto
        WHERE o.IDUsuario = ?
          AND eo.Nombre = 'Pagado'
        ORDER BY e.Fecha ASC
    `, [idUsuario]);
    return resultado;
};
module.exports = { obtenerTicketsUsuario };
