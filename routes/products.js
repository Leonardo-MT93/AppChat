const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar.jwt');
const { existeProducto } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, borrarProducto } = require('../controllers/products');



const router = Router();

// Obtener todas las categorias - publico
router.get('/',  obtenerProductos);

//Obtener una categoria en particular por id  - publico
//validar con un middleware personalizado
router.get('/:id', [
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
],
obtenerProducto
);

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatoria').not().isEmpty(),
 validarCampos
], crearProducto);

//Actualizar un registro por id - privado - cualquier persona con un token válido
router.put('/:id',[
    validarJWT,
    // check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existeProducto),
    // check('categoria', 'La categoria es obligatoria').not().isEmpty(),
    validarCampos,
],
actualizarProducto);

//Borrar categoria - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existeProducto),
    validarCampos,
],
borrarProducto);
module.exports = router;