const { validationResult } = require('express-validator');

const validarCampos = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json(error)
    }
    //Si esta todo ok, sigue con el siguiente middleware o validador
    next()
}

const validarArchivo = (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        //tiene de nombre archivo porque asi lo tenia en mi backend
        return res.status(400).json({ msg: "No hay archivos por subir - archivo" });
        
      }
    next();
}

module.exports = {
    validarCampos,
    validarArchivo
}