const { obtenerUsuarioPorCorreo } = require('../queries/usuariosQ');//para importar la consulta
const bcrypt = require('bcrypt');//
const iniciarSesion = async (correo, contrasena) => {
     const usuario = await obtenerUsuarioPorCorreo(correo);//recibe el correo, busca si existe un usuario con ese correo
      if (!usuario) {//valida si el correo está registradp
        return {
            exitoso: false,
            mensaje: 'Correo o contraseña incorrectos'
        };
    }
    const contrasenaValida = await bcrypt.compare(//si existe el correo se compara la contraseña ingresada con el hash guardado.
        contrasena,
        usuario.PasswordEncriptado
    );
    if (!contrasenaValida) {
    return {
        exitoso: false,
        mensaje: 'Correo o contraseña incorrectos'
    };
    }
    return {
    exitoso: true,
    usuario: {
        id: usuario.IDUsuario,
        nombre: usuario.PNombre + ' ' + usuario.PApellido,
        tipo: usuario.TipoUsuario
    }
    };
    /*
if (!usuario.Activo) {
    return {
        exitoso: false,
        mensaje: 'Tu cuenta está inactiva. Contacta al administrador.'
    };
}
*/
};

module.exports = {iniciarSesion};