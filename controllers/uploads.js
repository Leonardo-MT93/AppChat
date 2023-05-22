const { response } = require("express");
const { uploadFile } = require("../helpers");
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL); //Autenticacion en cloudinary


const { User, Product } = require("../models");

const updateImg = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let model;

  switch (coleccion) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpieza de imagenes previas:

  try {
    if(model.img){
      //Hay que borrar la imagen sel servidor
      const pathImagen = path.join( __dirname, '../uploads', coleccion, model.img);
      if(fs.existsSync(pathImagen)){ //Busca si existe el directorio
        fs.unlinkSync(pathImagen) // Borra la imagen solo si esa existe
      }
    }
  } catch (error) {

  }

  const nombre = await uploadFile(req.files, undefined, coleccion);
  model.img = nombre;

  await model.save();

  res.json(model);
};

const updateImgCloudinary = async (req, res = response) => {
  const { id, coleccion } = req.params;

  let model;

  switch (coleccion) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Limpieza de imagenes previas:

  if(model.img){
    //Hay que borrar la imagen del servidor de CLOUDINARY - Extraemos el ID de la imagen
    const nombreArr = model.img.split('/');
    const nombre = nombreArr[nombreArr.length-1];
    const [public_id] = nombre.split('.');
     cloudinary.uploader.destroy(public_id)
    
  }
  const {tempFilePath} = req.files.archivo;
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)//Le enviamos el filetemporalpath de nuestra imagen

  model.img = secure_url;

  await model.save();

  res.json(model);
};
const cargarArchivo = async (req, res = response) => {


  //Quiero subir extensiones txt o md

  try {
    // const path = await uploadFile(req.files, ['txt', 'md'], 'textos');
    const path = await uploadFile(req.files, undefined, "imgs"); //No envio extensiones porque voya subir imagenes = undefined, y la subcarpeta sera = imgs
    res.json({
      nombre: path,
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

const showImg = async(req, res = response) => {
  const { id, coleccion } = req.params;

  let model; // Si el modelo no existe habria que regresar una imagen por defecto

  switch (coleccion) {
    case "users":
      model = await User.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un usuario con el id ${id}`,
        });
      }
      break;
    case "products":
      model = await Product.findById(id);
      if (!model) {
        return res.status(400).json({
          msg: `No existe un producto con el id ${id}`,
        });
      }
      break;

    default:
      return res.status(500).json({ msg: "Se me olvidó validar esto" });
  }

  //Habria que fijarse si la iamgen esta preestablecida

  if(model.img){
    //Hay que borrar la imagen sel servidor
    const pathImagen = path.join( __dirname, '../uploads', coleccion, model.img);
    if(fs.existsSync(pathImagen)){ //Busca si existe el directorio
      return res.sendFile(pathImagen);
    }
  }
  const pathImagenNoEncontrada = path.join( __dirname, '../assets/no-image.jpg')
  return res.sendFile(pathImagenNoEncontrada);
}

module.exports = { cargarArchivo, updateImg, showImg, updateImgCloudinary };
