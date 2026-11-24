const conexion = require('../config/conexion');
const obtenerEventos = async () => {
    const [resultado] = await conexion.query(`
        SELECT *
        FROM vw_CarteleraEventos
        ORDER BY Fecha ASC, HoraInicio ASC
    `); //no sé si es necesario poner ese order by si en la vista ya tiene
    return resultado;
};

const obtenerCategorias = async () => {
    const [resultado] = await conexion.query(`
        SELECT DISTINCT Categoria
        FROM vw_CarteleraEventos
        ORDER BY Categoria ASC
    `);
    return resultado;
};
module.exports = { obtenerEventos , obtenerCategorias };