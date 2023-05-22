const { response } = require("express");
const {User, Category, Product} = require("../models");
const {ObjectId} = require('mongoose').Types;


const coleccionesPermitidas = ['users', 'categories', 'roles', 'products'];
const buscarUsuarios = async(termino ='', res = response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const usuario = await User.findById(termino);
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    //Busqueda insensible con regex
    const regex  = new RegExp(termino, 'i');

    const usuarios = await User.find({ //Si reemplazo el find por el count puedo Count me pasa la cantidad de busquedas encontradas
        $or: [{nombre: regex}, {correo: regex}], // TENEMOS LA FUNCIONALIDAD OR EN MONGO PARA PODER BUSCAR UN TERMINO RELACIONADO EN EL NOMBRE O EL CORREO
        $and: [{estado: true}] //Tiene que estar en true los resultados de la busqueda
    });
    res.json({
        results: usuarios
    })
}

const buscarCategorias = async(termino ='', res = response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const categoria = await Category.findById(termino);
        return res.json({
            results: (categoria) ? [categoria] : []
        })
    }
    //Busqueda insensible con regex
    const regex  = new RegExp(termino, 'i');

    const categoria = await Category.find({nombre: regex, estado: true});
    res.json({
        results: categoria
    })
}

const buscarProductos = async(termino ='', res = response)=>{
    const esMongoID = ObjectId.isValid(termino);

    if(esMongoID){
        const producto = await Product.find({
            $or: [{_id: termino}, {categoria: termino}]
        }).populate('categoria', 'nombre');
        return res.json({
            results: (producto) ? [producto] : []
        })
    }

    //Busqueda insensible con regex
    const regex  = new RegExp(termino, 'i');

    const producto = await Product.find({ //Si reemplazo el find por el count puedo Count me pasa la cantidad de busquedas encontradas
        $or: [{nombre: regex}, {descripcion: regex}, {'categoria.nombre': regex}], 
        $and: [{estado: true}] //Tiene que estar en true los resultados de la busqueda
    }).populate('categoria', 'nombre');
    res.json({
        results: producto
    })
}

  

const buscar = (req, res = response) => {

    const {coleccion, termino} = req.params;
    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch(coleccion){
        case 'users':
            buscarUsuarios(termino, res);
        break;
        case 'categories':
            buscarCategorias(termino, res);
        break;
        case 'products' :
            buscarProductos(termino, res);
        break;
        default:
            res.status(500).json({
                msg: "Se le olvido hacer esta búsqueda"
            })
    }

}


module.exports = buscar;