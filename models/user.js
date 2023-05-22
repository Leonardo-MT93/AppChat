const {Schema, model} = require('mongoose')


const userSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    contraseña: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
});

//Podemos crear metodos y/o modificar los existentes. En este caso eliminamos de pantalla la contraseña y la version al utilizar el .json

userSchema.methods.toJSON = function(){
    const {__v, contraseña, _id, ...user} = this.toObject();
    user.uid = _id;
    return user;
}




module.exports = model('User', userSchema);