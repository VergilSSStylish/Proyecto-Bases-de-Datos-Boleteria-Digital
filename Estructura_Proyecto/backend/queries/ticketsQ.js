const conexion = require('../config/conexion');

// boletos comprados por el usuario, una fila por boleto, con su estado ya calculado por la vista
const obtenerTicketsUsuario = async (idUsuario) => {//se necesita crear una vista o no sé
    const [resultado] = await conexion.query(`
        SELECT B.*,
               D.IDDevoluciones IS NOT NULL AS TieneDevolucion
        FROM vw_MisBoletos B
        LEFT JOIN Devoluciones D
            ON D.IDDetalleOrden = B.IDDetalleOrden
            AND D.Estado = 1
        WHERE B.IDUsuario = ?
        ORDER BY B.Fecha DESC, B.IDOrden, B.IDZonaPrecio, B.IDBoleto
    `, [idUsuario]);
    return resultado;
};

// Código de un boleto propio y activo (para generar su QR); undefined si no cumple
const obtenerCodigoActivo = async (idUsuario, idBoleto) => {
    const [resultado] = await conexion.query(`
        SELECT B.CodigoAlfanumerico
        FROM vw_MisBoletos B
        WHERE B.IDUsuario = ? AND B.IDBoleto = ? AND B.Estado = 'Activo'
          AND NOT EXISTS (
              SELECT 1
              FROM Devoluciones D
              WHERE D.IDDetalleOrden = B.IDDetalleOrden
                AND D.Estado = 1
          )
    `, [idUsuario, idBoleto]);
    return resultado[0];
};

// El boleto y, si es titular, sus acompañantes, solo si se pueden devolver
const obtenerBoletosDevolvibles = async (idUsuario, idBoleto) => {
    const [resultado] = await conexion.query(`
        SELECT IDBoleto, IDDetalleOrden, Subtotal FROM vw_MisBoletos
        WHERE IDUsuario = ? AND PuedeDevolver = 1 AND (IDBoleto = ? OR IDBoletoTitular = ?)
    `, [idUsuario, idBoleto, idBoleto]);
    return resultado;
};

// Una solicitud Pendiente (Estado 1) por boleto; el monto es lo que se pagó por cada uno
const registrarDevoluciones = async (boletos, motivo) => {
    await conexion.query(
        'INSERT INTO Devoluciones (IDDetalleOrden, Motivo, MontoReembolsado, Estado) VALUES ?',
        [boletos.map(b => [b.IDDetalleOrden, motivo, b.Subtotal, 1])]
    );
};

module.exports = { obtenerTicketsUsuario, obtenerCodigoActivo, obtenerBoletosDevolvibles, registrarDevoluciones };
