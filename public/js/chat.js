
const url = ( window.location.hostname.includes('localhost') )
            ? 'http://localhost:8080/api/auth/'
            : 'https://appchat-production-6bee.up.railway.app/';

let user = null;
let socket = null;

//Referencias HTML

const txtUid = document.querySelector("#txtUid");
const txtMensaje = document.querySelector("#txtMensaje");
const ulUsuarios = document.querySelector("#ulUsuarios");
const ulMensajes = document.querySelector("#ulMensajes");
const ulMensajesPrivados = document.querySelector("#ulMensajesPrivados");
const btnSalir = document.querySelector("#btnSalir");

const validarJWT = async () => {
  //VALIDA EL JWT DEL LOCALSTORAGE
  const token = localStorage.getItem("token");

  if (token == null || token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }

  const resp = await fetch(url
    , {
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

  socket.on('recibir-mensajes', dibujarMensajes);
  socket.on('usuarios-activos',dibujarUsuarios);
  socket.on('mensaje-privado', dibujarMensajesPrivados);
};


const dibujarUsuarios = (usuarios =[]) => {
  //construimos el html
  let usersHtml = '';
  usuarios.forEach( user => {
    usersHtml+=`
    <li>
      <p>
        <h5 class="text-success"> ${user.nombre}</h5>
        <span class="fs-6 text-muted">${user.uid}</span>
      </p>
    </li>`
  });
  ulUsuarios.innerHTML = usersHtml;
}


const dibujarMensajes = (mensajes =[]) => {
  //construimos el html
  let mensajesHtml = '';
  mensajes.forEach( ({nombre, mensaje}) => {
    mensajesHtml+=`
    <li>
      <p>
        <span class="text-primary"> ${nombre}:</span>
        <span class="fs-6 text-muted">${mensaje}</span>
      </p>
    </li>`
  });
  ulMensajes.innerHTML = mensajesHtml;
}

const dibujarMensajesPrivados = (payload) => {
  let {de, msg} = payload;
  // construimos el html
  let mensajesHtml = '';
  mensajesHtml+=`
    <li>
      <p>
        <span class="text-info fw-bold"> ${de}:</span>
        <span class="bg-info text-white p-1 rounded">${msg}</span>
      </p>
    </li>`
    ulMensajesPrivados.innerHTML = mensajesHtml;
}


txtMensaje.addEventListener('keyup', ({keyCode}) => {
  const msg = txtMensaje.value;
  const uid = txtUid.value;
  if( keyCode !== 13){return;}

  if(msg.length == 0){return;}

  socket.emit('enviar-mensaje', {msg, uid});

  txtMensaje.value = ''

})

const main = async () => {
  //Tengo que validar el JWT

  await validarJWT();
};

main();
