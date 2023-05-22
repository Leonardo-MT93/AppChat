const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (files,extensionesPermitidas = ["png", "jpg", "jpeg", "gif"],carpeta = "") => {
  //Trabajamos con promesa cuando queremos saber si sale bien o si sale mal

  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const nombreCortado = archivo.name.split(".");
    const extension = nombreCortado[nombreCortado.length - 1];
    //Entensiones permitidas -* Vienen como argumento

    if (!extensionesPermitidas.includes(extension)) {
      return reject(`La extension ${extension} no es válida. Extensiones permitidas: ${extensionesPermitidas}`);
    }

    const nombreTemp = uuidv4() + "." + extension;

    //El path en donde voy a enviar el archivo
    //Necesito recibir la carpeta en donde quieren que se almacenen los archivos - Por defecto estará vacio
    //Createparenpath en true - Va a crear la subcarpeta en caso de que no exista
    const uploadPath = path.join(__dirname, "../uploads/", carpeta, nombreTemp);

    archivo.mv(uploadPath, function (err) {
      if (err) {
        reject(err);
      }

      resolve(nombreTemp);
    });
  });
};



module.exports = {
    uploadFile
}