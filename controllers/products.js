const {response} = require('express');
const { Product, Category } = require('../models');

const obtenerProductos = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    const query = {estado : true};
    const [total, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .skip(desde)
            .limit(limite)
            .populate('user', 'nombre') //del usuario lo unico que muestro es el nombre
            .populate('categoria', 'nombre')
        ])
    var paginado = Math.ceil(total/limite)
    res.json({
        total,
        paginado,
        products
        
    });
}

const obtenerProducto = async(req, res = response) => {

    const {id} = req.params;
    const producto = await Product.findById(id).populate('categoria', 'nombre').populate('user', 'nombre');
    res.json( producto )
}


const crearProducto = async(req ,res = response) => {
    const nombre = req.body.nombre.toUpperCase();

    const productoDB = await Product.findOne({nombre})

    if(productoDB){
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe `
        });
    }
    const categoria = req.body.categoria.toUpperCase();
    const categoriaDB = await Category.findOne({nombre: categoria})

    if(!categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoria}, no existe `
        });
    }
    const precio = req.body.precio;
    const descripcion = req.body.descripcion;


    //Generar la data a guardar
    const data = {
        nombre, 
        user: req.user._id,
        precio,
        categoria: categoriaDB._id,
        descripcion
    }
    const producto = new Product(data);
    //Guardar db

    await producto.save();

    res.status(201).json(producto);
}

const actualizarProducto = async(req, res = response) => {
    const {id} = req.params;
    const {estado, usuario, ...data} = req.body;
    data.nombre = data.nombre.toUpperCase();
    const name = data.nombre;
    data.usuario = req.user._id; //ID DEL USUARIO QUE ESTA ACTUALIZANDO
    const producto = await Product.findOne({nombre: name})

    if(producto){
        return res.status(400).json({
            msg: `El producto ${producto.nombre}, ya existe.`
        });
    }
    const categoria = data.categoria.toUpperCase();
    const categoriaDB = await Category.findOne({nombre: categoria})
    if(!categoriaDB){
        return res.status(400).json({
            msg: `La categoria ${categoria} no existe.`
        });
    }
    data.categoria = categoriaDB._id;
    //AGREGAMOS {new:true} para que nos devuelva el valor actualziado
    const productoUpdated = await Product.findByIdAndUpdate(id, data, {new:true} ).populate('user', 'nombre');
    
    res.json({
        productoUpdated
    });
}

const borrarProducto = async(req, res = response) => {
    const {id} = req.params;
    //AGREGAMOS {new:true} para que nos devuelva el valor actualziado
    const productoBorrado = await Product.findByIdAndUpdate(id, {estado: false}, {new:true} );
    
    res.json(productoBorrado);
}


module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}