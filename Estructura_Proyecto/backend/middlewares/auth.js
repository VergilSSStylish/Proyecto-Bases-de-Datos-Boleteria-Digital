const {verificarJWT} = require('../utils/jwt');

module.exports = function verificarToken(req,res,next){
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

if(!token){
    return res.status(401).json({mensaje: 'No autenticado'});
}

try{
    const payload = verificarJWT(token);
    req.usuarioId = payload.id;
    next();
        } catch(error){
    return res.status(401).json({mensaje: 'Token invalido o expirado'});
    }
}
