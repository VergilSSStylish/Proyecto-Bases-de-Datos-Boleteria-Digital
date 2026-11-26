const db = require('../config/conexion');
const obtenerUsuarioPorCorreo = async (correo) => {
    const [resultado] = await db.query(//el estado de usuario debe incluirse si se considera necesario, pero no esta en la base de datos
        `SELECT u.IDUsuario, u.PNombre,u.PApellido,
            u.Correo, u.PasswordEncriptado, u.IDTipoUsuario,
            t.Nombre AS TipoUsuario
            FROM Usuario u
        INNER JOIN TipoUsuario t ON t.IDTipoUsuario = u.IDTipoUsuario
            WHERE u.Correo = ?`,
        [correo]
    );
    return resultado[0];
};

const insertarUsuario = async (usuario) => {
    const [resultado] = await db.query(
        `INSERT INTO Usuario (
            PNombre,SNombre, PApellido, SApellido,Telefono,
            Correo, FechaNac,Genero, RTN,PasswordEncriptado,IDTipoUsuario
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            usuario.primerNombre,
            usuario.segundoNombre || null,
            usuario.primerApellido,
            usuario.segundoApellido || null,
            usuario.telefono,
            usuario.correo,
            usuario.fechaNacimiento,
            usuario.genero || null,
            usuario.rtn || null,
            usuario.password,
            usuario.IDTipoUsuario
        ]
    );
    return resultado.insertId;
};
module.exports = {obtenerUsuarioPorCorreo,insertarUsuario};
