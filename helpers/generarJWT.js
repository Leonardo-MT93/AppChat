const jwt = require('jsonwebtoken');
const { User } = require('../models');


const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {

        const payload = {uid};
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        }, (err, token) => {
            if(err){
                console.log(err);
                reject('No se pudo generar el token');
            }else{
                resolve(token);
            }
        })


    })
}
//validacion del jwt que llega por sockets


const comprobarJWT = async(token = '') => {
    try {
       //QUE EXISTA EL TOKEN
        if(token.length <10){
            return null;
        }

        const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

        //Validamos el usuario que exista y que su estado sea
        const user = await User.findById(uid)
        if( user) {

            if(user.estado){
                return user;
            }else{
                return null;
            }
            
        }else{
            return null;
        }

    } catch (error) {
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT
}