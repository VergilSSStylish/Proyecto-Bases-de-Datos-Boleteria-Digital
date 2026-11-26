const crypto = require('crypto');

function hmac(texto){
    return crypto
        .createHmac('sha256', process.env.JWT_SECRET)
        .update(texto)
        .digest('base64url');
}

//craecion deun token
function firmarToken(payload, expiraEnSegundos = 7200){
    const ahora = Math.floor(Date.now() / 1000);
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const cuerpo = Buffer.from(JSON.stringify({
        ...payload,
        iat: ahora,
        exp: ahora + expiraEnSegundos
    })).toString('base64url');
    return `${header}.${cuerpo}.${hmac(`${header}.${cuerpo}`)}`; 
}

//parte de la verificacion de un token
function verificarJWT(token){
    const partes = token.split('.');
    if(partes.length !== 3) throw new Error('Formato Invalido');

    const [header, cuerpo, firma] = partes;

    const esperada = Buffer.from(hmac(`${header}.${cuerpo}`));
    const recibida = Buffer.from(firma);
    if (esperada.length !== recibida.length || !crypto.timingSafeEqual(esperada,recibida)){
        throw new Error('Firma invalida');
    }

    const cabecera = JSON.parse(Buffer.from(header,'base64url').toString());
    if(cabecera.alg !== 'HS256') throw new Error('Algoritmo no permitido');

    const payload = JSON.parse(Buffer.from(cuerpo, 'base64url').toString());
    if(payload.exp && payload.exp <Math.floor(Date.now()/1000)){
        throw new Error('Token Expirado');
    }
    return payload
}

module.exports = {firmarToken, verificarJWT};