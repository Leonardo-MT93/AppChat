    const miFormulario = document.querySelector('form');


    const url = ( window.location.hostname.includes('localhost') )
    ? 'http://localhost:8080/api/auth/'
    : 'https://appchat-production-6bee.up.railway.app/';

    miFormulario.addEventListener('submit', (e)=> {
        e.preventDefault();
        const formData = {};

        for(let el of miFormulario.elements){
           if(el.name.length > 0){
            formData[el.name] = el.value;
           } 
        }

        fetch(url+'login', {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {'Content-Type': 'application/json'}
        })
        .then( resp => resp.json())
        .then( ({msg, token}) => {
            if(msg){
                return console.error(msg);
            }
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch( err => {
            console.log(err)
        })
    })
    

      function handleCredentialResponse(response) {
        //Google Token = ID_TOKEN
        //  console.log('ID_TOKEN',response.credential);
        const body = { id_token: response.credential };
        fetch(url + 'google', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((resp) => resp.json())
        //   .then((resp) => {
        //     console.log(resp);
        //     localStorage.setItem("email", resp.user.correo);
        //   })
        .then(({token})=> {
            //Se pueden hacer validaciones en caso de que haya algun error
            console.log(token);
            localStorage.setItem('token', token); //Guardamos el token del usuario autenticado en el localstorage
            window.location = 'chat.html';
        } )
          .catch(console.warn);
      }

      const button = document.getElementById("google_signout");
      button.onclick = () => {
        console.log(google.accounts.id);
        google.accounts.id.disableAutoSelect();
        google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
          localStorage.clear();
          location.reload();
        });
      };
