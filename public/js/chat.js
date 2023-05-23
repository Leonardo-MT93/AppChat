const url = "http://localhost:8080/api/auth/";

let user = null;
let socket = null;

const validarJWT = async () => {
  //VALIDA EL JWT DEL LOCALSTORAGE
  const token = localStorage.getItem("token");

  if (token == null || token.length <= 10) {
    window.location = "index.html";
    throw new Error("No hay token en el servidor");
  }
  try {
    const resp = await fetch(url, {
      headers: { "x-token": token },
    });

    const { user: userDB, token: tokenDB } = await resp.json();

    // console.log(userDB, tokenDB);
    //Seteamos el token renovado

    localStorage.setItem("token", tokenDB);
    user = userDB;
    document.title = user.nombre;

    await conectarSocket();
  } catch (error) {
    console.log(error);
    window.location = "index.html";
  }
};

const conectarSocket = async () => {
  //Conexion con el backend
  const socket = io({
    //parametros para enviar al websocket en la documentacion
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });
};

const main = async () => {
  //Tengo que validar el JWT

  await validarJWT();
};

main();
