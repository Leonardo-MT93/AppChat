const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");

const socketController = async(socket = new Socket()) => { //ESTO DE DECLARAR EL SOCKET COMO UN NEW SOCKET NO SE DEBE HACER!! ES SOLO PARA PODER OBTENER LAS FUNCIONALIDADES DE SOCKET Y PARA USAR EN DESARROLLO

    //Validar antes de entrar - ya realizado
    const token = socket.handshake.headers['x-token'];

    const user = await comprobarJWT(token);

    if(!user){
        return socket.disconnect();
    }else{
        console.log('Se conecto: ' + user.nombre)
    }

    
}

module.exports = {
    socketController
}