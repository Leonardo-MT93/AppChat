const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos, validarArchivo } = require('../middlewares/validar-campos');
const {cargarArchivo, showImg, updateImgCloudinary} = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');


const router = Router();

router.post('/',validarArchivo,
//aplicar validaciones - middlewares-
cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivo,
    check('id', 'El id dbe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['users', 'products'])),
    validarCampos
], updateImgCloudinary)

router.get('/:coleccion/:id', [
    check('id', 'El id dbe ser de Mongo').isMongoId(),
    check('coleccion').custom( c => coleccionesPermitidas(c, ['users', 'products'])),
    validarCampos 
], showImg)

module.exports = router;