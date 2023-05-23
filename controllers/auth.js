const { response, json } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, contraseña } = req.body;

  try {
    //Verificar si el email existe
    const user = await User.findOne({ correo });
    if (!user) {
      return res.status(400).json({
        msg: "Usuario/Password no son validos",
      });
    }
    //Verificar si el usuario esta activo en la bd
    if (!user.estado) {
      return res.status(400).json({
        msg: "Usuario/Password no son validos - estado:false",
      });
    }
    //Verificar la contraseña
    const validPassword = bcryptjs.compareSync(contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario/Password no son validos - password",
      });
    }
    //Generar el JWT

    const token = await generarJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el admin.",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, nombre, imagen } = await googleVerify(id_token);
    let user = await User.findOne({ correo });
    if (!user) {
      //tengo que crearlo

      const data = {
        nombre,
        correo,
        contraseña: "LT",
        imagen,
        rol: "USER_ROLE",
        google: true,
      };
      user = new User(data);
      await user.save();
    } //else si el user ya existe
    //Si el user tiene el estado en false lo niego
    if (!user.estado) {
      return res.status(401).json({
        msg: "Hable con el administrador, usuario bloqueado",
      });
    }
    //Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

const renovarToken = async(req, res = response) => {
   const { user} = req;

   //necesito regenerar el jwt

   const token = await generarJWT(user.id);


   res.json({
    user,
    token
   })
}

module.exports = {
  login,
  googleSignIn,
  renovarToken
};
