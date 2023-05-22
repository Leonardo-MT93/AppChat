const { response} = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');



//Definimos que hace cada una de las rutas
const usuariosGet = async(req, res = response) => {
    // const query = req.query;
    // const {q, nombre = 'No name', apikey, page, limit} = req.query;
    const {limite = 5, desde = 0} = req.query;
    //USUARIOS ACTIVOS CON EL ESTADO EN TRUE
    const query = {estado : true};
    // const users = await User.find(query)
    // .skip(desde)
    // .limit(limite);

    // const total = await User.countDocuments(query);

    // SE EJECUTAN AMBAS PROMESAS EN SIMULTANEO ----- y utilizamos la DESESTRUCUTRACION ------- SUPER UTIL YA QUE SIMPLIFICAMOS EL TIEMPO A LA MITAD
    const [total, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query)
            .skip(desde)
            .limit(limite)  
    ])
    res.json({
        total,
        users
    });
}

const usuariosPost = async(req, res = response) => {
    

    const {nombre, correo, contraseña, rol} = req.body;
    const user = new User({nombre, correo, contraseña, rol});

    //Verificar si el correo existe
    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    user.contraseña = bcryptjs.hashSync(contraseña, salt);

    //Guardar en DB
    await user.save();

    //Evitamos mostrar la contraseña del usuario


    res.json({
        user
    });
}

const usuariosPut = async(req, res = response) => {
//PARAMETROS Y NOMBRE DE LA RUTA = :id
    const {id} = req.params;
    const {_id, contraseña, google, correo, ...resto} = req.body;
    //TODO VALDIAR CONTRA LA BASE DE DATOS

    if( contraseña){
        const salt = bcryptjs.genSaltSync();
        resto.contraseña = bcryptjs.hashSync(contraseña, salt);
    }

    const userDB = await User.findByIdAndUpdate(id, resto);

    res.json({
        userDB
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - controlador"
    });
}

const usuariosDelete = async(req, res = response) => {

    const {id} = req.params;

    const uid = req.uid;

    // const user = await User.findByIdAndDelete(id); NO DEBEMOS ELIMINAR COMPLETAMENTE AL USUARIO DE NUESTRA BD

    //Borrado pero en realidad le sacamos el estado a FALSE --- RECOMENDADO
    const user = await User.findByIdAndUpdate(id, {estado: false});
    //Recogiendo el uid del token, busco entre los usuarios almacenados los datos del mismo.
    // const userAuth = await User.findById(uid);
    //Obtenemos por medio de la request al usuario autenticado - Validar.jtw
    // const userAuth = req.user;

    res.json({
        user
    });
}
module.exports = {
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosPatch,
    usuariosDelete

}