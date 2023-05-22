const {response} = require('express');
const {Category} = require('../models');

//Obtener categorias - paginado - total - populate(mongoose)
const obtenerCategorias = async(req, res = response) => {

    const {limite = 5, desde = 0} = req.query;
    const query = {estado : true};
    const [total, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .skip(desde)
            .limit(limite)
            .populate('user', 'nombre') //del usuario lo unico que muestro es el nombre
    ])
    var paginado = Math.ceil(total/limite)
    res.json({
        total,
        paginado,
        categories,
        
    });
}

//Obtener categoria - populate {objeto de la categoria}
const obtenerCategoria = async(req, res = response) => {

    const {id} = req.params;
    const categoria = await Category.findById(id).populate('user', 'nombre');
    res.json( categoria )
}


const crearCategoria = async(req ,res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Category.findOne({nombre})

    if(categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe `
        });
    }
    //Generar la data a guardar
    const data = {
        nombre, 
        user: req.user._id
    }
    const categoria = new Category(data);
    //Guardar db

    await categoria.save();

    res.status(201).json(categoria);
}

//Actualizar categoria - nombre | El nombre no deberia existir

const actualizarCategoria = async(req, res = response) => {
        const {id} = req.params;
        const {estado, usuario, ...data} = req.body;
        data.nombre = data.nombre.toUpperCase();
        const name = data.nombre;
        data.usuario = req.user._id; //ID DEL USUARIO QUE ESTA ACTUALIZANDO
        const categoria = await Category.findOne({name})

        if(categoria){
            return res.status(400).json({
                msg: `La categoria ${categoria.nombre}, ya existe `
            });
        }
        //AGREGAMOS {new:true} para que nos devuelva el valor actualziado
        const categoriaUpdated = await Category.findByIdAndUpdate(id, data, {new:true} );
        
        res.json({
            categoriaUpdated
        });
    }


//Borrar categoria - cambiar estado a false
const borrarCategoria = async(req, res = response) => {
    const {id} = req.params;
    //AGREGAMOS {new:true} para que nos devuelva el valor actualziado
    const categoriaBorrada = await Category.findByIdAndUpdate(id, {estado: false}, {new:true} );
    
    res.json(categoriaBorrada);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}