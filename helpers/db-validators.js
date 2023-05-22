const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const esRoleValido =  async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la DB`);
    }
};

const emailExiste = async(correo = '') => {
    const existeMAIL = await User.findOne({ correo });
    if(existeMAIL){
        throw new Error(`El correo  ${correo} ya esta registrado en la DB`);
    }
} 
const existeUsuarioporID = async(id) => {
    const existeID = await User.findById(id);
    if(!existeID){
        throw new Error(`El ID  ${id} no existe `);
    }
}

const existeCategoria = async(id) => {
    const existeCat = await Category.findById(id);
    if(!existeCat){
        throw new Error(`La Categoria con id:  ${id} no existe `);
    }
}

const existeProducto = async(id) => {
    const existeProd = await Product.findById(id);
    if(!existeProd){
        throw new Error(`El producto con id: ${id} no existe `);
    }
}

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {
    if(!colecciones.includes(coleccion)){
        throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`);
    }
    return true; // Hay que agregar un return TRUE porque estamos enviando una funcion con argumentos.
}




module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioporID,
    existeCategoria,
    existeProducto,
    coleccionesPermitidas
}