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
    )
    
    {
        return {
            exitoso: false,
            mensaje: 'Complete todos los campos obligatorios.'
        };
    }

    
if (!validarFechaNacimiento(datos.fechaNacimiento)) {
    return {
        exitoso: false,
        mensaje: 'La fecha de nacimiento no es válida. No cumples con el requisito de edad mínima para continuar.'
    }
};

    // valida longitud de la contrasena
    if (datos.contrasena.length < 8) {
        return {
            exitoso: false,
            mensaje: 'La contraseña debe tener al menos 8 caracteres.'
        };
    }
    const usuarioExistente = await obtenerUsuarioPorCorreo(datos.correo);//valida que el correo no este registrado
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
function validarFechaNacimiento(fecha) {
    if (!fecha || typeof fecha !== 'string') {
        return false;
    }

    const nacimiento = new Date(`${fecha}T00:00:00`);
    const hoy = new Date();

    // Comprobar que la fecha sea válida
    if (Number.isNaN(nacimiento.getTime())) {
        return false;
    }

 // comprobar que la fecha realmente exista
    if (
        fechaValidada.getFullYear() !== anio ||
        fechaValidada.getMonth() !== mes - 1 ||
        fechaValidada.getDate() !== dia
    ) {
        return false;
    }

    // No permitir fechas futuras
    if (nacimiento > hoy) {
        return false;
    }

    // Calcular edad
    let edad = hoy.getFullYear() - nacimiento.getFullYear();

    const noHaCumplidoAnios =
        hoy.getMonth() < nacimiento.getMonth() ||
        (hoy.getMonth() === nacimiento.getMonth() &&
         hoy.getDate() < nacimiento.getDate());

    if (noHaCumplidoAnios) {
        edad--;
    }

    return edad >= 16;
}
module.exports = { registrarUsuario,validarFechaNacimiento };