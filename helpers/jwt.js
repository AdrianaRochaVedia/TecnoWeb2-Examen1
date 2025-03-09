const jwt = require('jsonwebtoken');

//Trabajar en base a promesas, envez de callbacks

const generarJWT = ( uid, name) => {

    return new Promise( (resolve, reject) => {

        const payload = { uid, name };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, { //Sign para firmar un token, 
            expiresIn: '1d' //Que token expire en 2 horas
        }, (err, token) => { //Un callback que recibe un error y el token
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve(token);
        });
    });
    
}
module.exports = {
    generarJWT
}