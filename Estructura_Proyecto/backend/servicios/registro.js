const bcrypt = require('bcrypt');
const {
    obtenerUsuarioPorCorreo,
    insertarUsuario
} = require('../queries/usuariosQ');
const registrarUsuario = async (datos) => {
    // valida campos obligatorios
    if (
        !datos.primerNombre ||
        !datos.primerApellido ||
        !datos.telefono ||
        !datos.correo ||
        !datos.fechaNacimiento ||
        !datos.contrasena
    ) {
        return {
            exitoso: false,
            mensaje: 'Complete todos los campos obligatorios.'
        };
    }
    // valida longitud de la contrasena
    if (datos.contrasena.length < 8) {
        return {
            exitoso: false,
            mensaje: 'La contraseña debe tener al menos 8 caracteres.'
        };
    }
    const usuarioExistente = await obtenerUsuarioPorCorreo(datos.correo);//validar que el correo no este registrado
    if (usuarioExistente) {
    return {
        exitoso: false,
        mensaje: 'Este correo ya está registrado.'
    };
    }
     //para encripta la contraseña
    const passwordEncriptado = await bcrypt.hash(datos.contrasena, 10);
// Insertar el usuario
    const nuevoUsuario = {
        ...datos,
        password: passwordEncriptado,
        IDTipoUsuario: 4
    };
    const idUsuario = await insertarUsuario(nuevoUsuario);
    return {
        exitoso: true,
        mensaje: 'Usuario registrado correctamente.',
        idUsuario: idUsuario
    };
};
module.exports = { registrarUsuario };