const url = "http://localhost:8080/api/auth/";

let user = null;
let socket = null;

//Referencias HTML

const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
  //VALIDA EL JWT DEL LOCALSTORAGE
  const token = localStorage.getItem("token");

  if (token == null || token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url, {
    headers: { "x-token": token },
  });

  const { user: userDB, token: tokenDB } = await resp.json();

  // console.log(userDB, tokenDB);
  //Seteamos el token renovado

  try {
    localStorage.setItem("token", tokenDB);
    user = userDB;
    document.title = user.nombre;

    await conectarSocket();
  } catch (error) {
    console.log(error);
    window.location = "index.html";
  }
};

const conectarSocket = async() => {
  //Conexion con el backend
  socket = io({
    //parametros para enviar al websocket en la documentacion
    'extraHeaders': {
      'x-token': localStorage.getItem('token'),
    }
  });

  socket.on('connect', () => {
    console.log('Sockets Online');
  });

  socket.on('disconnect', () => {
    console.log('Sockets Offline');
  });

  socket.on('recibir-mensajes'),
    () => {
      //TODO: recibir mensajes
    };
  socket.on('usuarios-activos'),
    (payload) => {
      console.log(payload);
    };
  socket.on('mensaje-privado'),
    () => {
      //TODO: mensajes privados recibidos
    };
};

const main = async () => {
  //Tengo que validar el JWT

  await validarJWT();
};

main();
