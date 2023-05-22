const { response } = require("express");


//ESTE MIDDLEWARE OBLIGA A QUE SEA ADMINISTRADOR
const esAdminRole = (req, res = response, next) => {
    if(!req.user){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol  sin validar el token primero'
        })
    }

    const {rol, nombre} = req.user;

    if(rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede hacer esto`
        })
    }

    next();

}

//ESTE MIDDLEWARE TIENE OPCIONES DE ROLES QUE PUEDA REALIZAR LA ACCION
//Spread operator
const tieneRole = (  ...roles) => {
    return (req, res = response, next) => {

        if(!req.user){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol  sin validar el token primero'
            })
        }
        if(!roles.includes(req.user.rol)){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${ roles } `
            })
        } 

        next();
    }
}

module.exports = {
    esAdminRole, 
    tieneRole
};