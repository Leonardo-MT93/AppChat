const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require("../models");

const chatMensajes = new ChatMensajes();


const socketController = async(socket = new Socket(), io) => { //ESTO DE DECLARAR EL SOCKET COMO UN NEW SOCKET NO SE DEBE HACER!! ES SOLO PARA PODER OBTENER LAS FUNCIONALIDADES DE SOCKET Y PARA USAR EN DESARROLLO

    //Validar antes de entrar - ya realizado
    const token = socket.handshake.headers['x-token'];

    const user = await comprobarJWT(token);

    if(!user){
        return socket.disconnect();
    }
    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(user);
    //Compruebo que efectivamente usuariosArr tenga a los usuarios conectados
    console.log(chatMensajes.usuariosArr)
    
    io.emit('usuarios-activos', chatMensajes.usuariosArr);//No es necesario el broadcast ya que el io es global
     
    //Limpiar los usuairos desconectados
}

module.exports = {
    socketController
}