//Desestructuramos para sacar una instancia de Express
const { Router } = require('express');
const { check } = require('express-validator');
const { esRoleValido, emailExiste, existeUsuarioporID } = require('../helpers/db-validators');
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require('../controllers/users');
// const { validarCampos } = require('../middlewares/validar-campos');
// const { validarJWT } = require('../middlewares/validar.jwt');
// const {esAdminRole, tieneRole} = require('../middlewares/validar-roles');
const { validarCampos, validarJWT, esAdminRole, tieneRole} = require('../middlewares'); ///SIMPLIFICACION

const router = Router();



router.get('/', usuariosGet);

router.put('/:id',[
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioporID),
    check('rol').custom( esRoleValido),
    validarCampos
], usuariosPut);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom( emailExiste ),
    check('contraseña', 'La contraseña es obligatoria y debe de ser mayor de 6 letras').isLength({min: 6}),
    // check('rol', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('rol').custom( esRoleValido),
    validarCampos
],usuariosPost);

router.delete('/:id', [   
    validarJWT,
    // esAdminRole,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioporID),
    validarCampos
], usuariosDelete);

router.patch('/', usuariosPatch);




module.exports = router;