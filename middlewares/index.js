//La carpeta middlewares busca automaticamente el archivo index.js, de esta manera puedo simplificar las importaciones
const  validarCampos  = require('../middlewares/validar-campos');
const  validarJWT  = require('../middlewares/validar.jwt');
const validaRoles = require('../middlewares/validar-roles');

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles
}