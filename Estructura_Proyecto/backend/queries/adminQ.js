
const conexion = require('../config/conexion');

async function obtenerAdministrador(idUsuario) {//info del admin, crear vista 
    const [resultado] = await conexion.query(`
        SELECT
            U.IDUsuario,
            CONCAT_WS(' ',
                U.PNombre,
                U.SNombre,
                U.PApellido,
                U.SApellido
            ) AS Nombre,
            U.Correo,
            TU.Nombre AS TipoUsuario
        FROM Usuario U
        INNER JOIN TipoUsuario TU
            ON U.IDTipoUsuario = TU.IDTipoUsuario
        WHERE U.IDUsuario = ?
          AND TU.Nombre = 'Administrador'
    `, [idUsuario]);

    return resultado[0] || null;
}

async function obtenerIngresos() {
    const [resultado] = await conexion.query(`
        SELECT
            COALESCE(SUM(IngresosTotales), 0) AS Total
        FROM vw_IngresosPorEvento
    `);

    return resultado[0].Total;
}

async function obtenerBoletosVendidos() {
    const [resultado] = await conexion.query(`
        SELECT
            COALESCE(SUM(TotalBoletosVendidos), 0) AS Total
        FROM vw_EventosMasVendidos
    `);
    return resultado[0].Total;
}


async function obtenerEventosActivos() {
    const [resultado] = await conexion.query(`
        SELECT
            COUNT(DISTINCT IDEvento) AS Total
        FROM vw_CarteleraEventos
    `);
    return resultado[0].Total;
}

async function obtenerClientes() {//mostrar usuarios que son clientes totales registrados
    const [resultado] = await conexion.query(`
        SELECT
            COUNT(U.IDUsuario) AS Total
        FROM Usuario U
        INNER JOIN TipoUsuario TU
            ON U.IDTipoUsuario = TU.IDTipoUsuario
        WHERE TU.Nombre = 'Cliente'
    `);
    return resultado[0].Total;
}

async function obtenerProximosEventos() {
    const [resultado] = await conexion.query(`
        SELECT DISTINCT
            IDEvento,
            Titulo,
            Fecha,
            HoraInicio,
            NombreRecinto,
            Municipio
        FROM vw_CarteleraEventos
        WHERE Fecha >= CURDATE()
        ORDER BY Fecha ASC, HoraInicio ASC
        LIMIT 5
    `);
    return resultado;
}


async function obtenerIngresosPorEvento() {
    const [resultado] = await conexion.query(`
        SELECT
            IDEvento,
            NombreEvento,
            IngresosTotales
        FROM vw_IngresosPorEvento
        ORDER BY IngresosTotales DESC
    `);

    return resultado;
}

async function obtenerOcupacionPorZona() {
    const [resultado] = await conexion.query(`
        SELECT
            NombreEvento,
            NombreZona,
            CapacidadTotal,
            CupoDisponible,
            CuposOcupados,
            PorcentajeOcupacion
        FROM vw_TaquillaOcupacion
        ORDER BY NombreEvento, NombreZona
    `);
    return resultado;
}

async function obtenerEventosMasVendidos() {
    const [resultado] = await conexion.query(`
        SELECT
            IDEvento,
            NombreEvento,
            TotalBoletosVendidos
        FROM vw_EventosMasVendidos
        ORDER BY TotalBoletosVendidos DESC
        LIMIT 10
    `);

    return resultado;
}

module.exports = {
    obtenerAdministrador,obtenerIngresos,obtenerBoletosVendidos,obtenerEventosActivos,
    obtenerClientes,obtenerProximosEventos,obtenerIngresosPorEvento,obtenerOcupacionPorZona,
    obtenerEventosMasVendidos
};
