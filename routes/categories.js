const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar.jwt');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, borrarCategoria } = require('../controllers/categories');
const { existeCategoria } = require('../helpers/db-validators');
const { esAdminRole } = require('../middlewares');



const router = Router();

//Obtener todas las categorias - publico
router.get('/',  obtenerCategorias);

//Obtener una categoria en particular por id  - publico
//validar con un middleware personalizado
router.get('/:id', [
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existeCategoria),
    
    validarCampos,
    
],
obtenerCategoria
);

//Crear categoria - privado - cualquier persona con un token válido
router.post('/', [validarJWT,
 check('nombre', 'El nombre es obligatorio').not().isEmpty(),
 validarCampos

], crearCategoria);

//Actualizar un registro por id - privado - cualquier persona con un token válido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoria),
    validarCampos,
    
],
actualizarCategoria);

//Borrar categoria - privado - Admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID de Mongo válido' ).isMongoId(),
    check('id').custom(existeCategoria),
    validarCampos,
    
],
borrarCategoria);
module.exports = router;