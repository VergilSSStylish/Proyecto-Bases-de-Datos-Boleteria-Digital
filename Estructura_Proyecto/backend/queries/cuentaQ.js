const conexion = require('../config/conexion');

const obtenerPerfil = async (idUsuario) =>{
    const [resultado] =  await conexion.query(
       `SELECT IDUsuario,  
                 CONCAT_WS(' ', PNombre, PApellido) AS Nombre, Correo
                FROM Usuario
                Where IDUsuario = ?`,
                [idUsuario]
    );
    return resultado[0];
};

const obtenerTarjetas = async (idUsuario) => {
    const [resultado] = await conexion.query(
        `SELECT
        t.IDTarjeta AS IDTarjeta,
        t.NombreTitular as Titular,
        tt.NombreTipo  AS Marca,
        RIGHT(t.PAN,4) as Ultimos4,
        MONTH(t.FechaExp) AS MesExp,
        YEAR(t.FechaExp) AS AnioExp
        FROM Tarjeta t 
        INNER JOIN TiposTarjetas tt on tt.IDTiposTarjetas = t.IDTiposTarjetas
        WHERE t.IDUsuario = ?
        ORDER BY t.IDTarjeta DESC`,
        [idUsuario]
    );
    return resultado;
}

const obtenerIdTipoTarjeta = async (nombreTipo) =>{
    const [resultado] = await conexion.query(
        'SELECT IDTiposTarjetas FROM TiposTarjetas WHERE NombreTipo = ? LIMIT 1',
        [nombreTipo]
    );
    return resultado.length ? resultado[0].IDTiposTarjetas : null;
};

const agregarTarjeta = async (idUsuario, titular, panEnmascarado, fechaExp, idTipoTarjeta) =>{
    // ehhhh guys, creo que se tiene que hacer un cambio en la tarjeta porque el cvv NUNCA  se guarda en el BD XD entonces pongo 000 para no alterar la BD XDDDD
    const [resultado] = await conexion.query(
        `
        INSERT INTO Tarjeta(PAN, NombreTitular, CVV, FechaExp, IDTiposTarjetas, IDUsuario)
        VALUES (?,?,'000', ?, ?, ?)
        `,
        [panEnmascarado, titular, fechaExp, idTipoTarjeta, idUsuario]
    );
    return resultado.insertId
};

const eliminarTarjeta = async (idTarjeta, idUsuario) => {
    const [resultado] = await conexion.query(
         'DELETE FROM Tarjeta WHERE IDTarjeta = ? AND IDUsuario = ?',
        [idTarjeta, idUsuario] // el AND IDUsuario evita borrar tarjetas de otros
    );
    return resultado.affectedRows;
};

module.exports = {
    obtenerPerfil,
    obtenerTarjetas,
    obtenerIdTipoTarjeta,
    agregarTarjeta,
    eliminarTarjeta
};





