const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validarJWT = async(req, res = response, next) => {

    const token = req.header("x-token");
    if(!token){
        return res.status(401).json({
            "msg": 'No hay token de autenticacion'
        })
    }

    try {
        //Verificamos el token
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        //Con la verificacion extraigo el uid correpondiente al token autorizado
        // req.uid = uid;
        


        const user = await User.findById(uid);
        req.user = user;
        //----------- Validar que exista el usuario correpondiente al token valido
        if(!user){
            return res.status(401).json({
                "msg": "Token no valido - Usuario inexistente"
            })
        }
        //----------- Verificar si el usuario tiene estado en TRUE
        if(!user.estado){
            return res.status(401).json({
                "msg": "Token no valido - Usuario con estado false"
            })
        }
        next();
    } catch (error) {
        res.status(401).json({
            "msg": 'Token no valido'
        })
    }



}


module.exports = {
    validarJWT
}