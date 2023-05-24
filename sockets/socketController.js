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
    //Lista de los ultimos 10 mensajes para el usuario que recien se conecta
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);
    //Lista de usuarios conectados
    io.emit('usuarios-activos', chatMensajes.usuariosArr);//No es necesario el broadcast ya que el io es global
    //Mensajes privados - Los usuarios conectados al socket estan relacionados para el chat global y otra sala con su propio id
    //Enlazamos al usuario a una sala privada con su propio id - ya que el socket.id se actualiza si el cliente recarga la pagina
    //Lo conectamos a una sala especial
    socket.join( user._id.toString()); //global, socket.id, user._id
    
    //Limpiar los usuairos desconectados
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(user._id);
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    })

    socket.on('enviar-mensaje', ({uid, nombre,  msg}) => {
        if(uid){
            //mensaje privado
            //*** ERROR PRINCIPAL POR EL CUAL NO SE ENCONTRABA EL ID. YO PASABA EL USER._ID PERO ESTE NO ESTABA FORMATEADO COMO UN ID ASIQUE NUNCA ENCONTRABA NADA. SOLUCION "user.id" ó "user._id.toString()" */
            console.log(user.id);
            console.log(user._id);
            console.log(user._id.toString());
            // chatMensajes.enviarMensaje(user._id, user.nombre, msg)
            socket.to(uid).emit('mensaje-privado', {de: user.nombre, msg})
        }else{
            //sala global
            chatMensajes.enviarMensaje(user.id, user.nombre, msg);
            //Mnesaje a todo el mundo
            io.emit('recibir-mensajes', chatMensajes.ultimos10);
        }
    })
}

module.exports = {
    socketController
}