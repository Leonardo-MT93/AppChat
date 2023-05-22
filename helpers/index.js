const generarJWT = require('../helpers/generarJWT');
const validatorDB = require('../helpers/db-validators');
const googleVerify = require('../helpers/google-verify');
const uploadFile = require('../helpers/upload-file');

module.exports = {
    ...generarJWT,
    ...validatorDB,
    ...googleVerify,
    ...uploadFile
}