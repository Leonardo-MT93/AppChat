
 const Category = require('./category');
 const Role = require('./role');
 const Server = require('./server');
 const User = require('./user');
 const Product = require('./product')


 // 2 formas de generar importaciones de todos nuestros modelos almacenados. - La 2da es mejor, porque es mas limpio y mas fácil de leer
 
//  module.exports =  require('./category');
//  module.exports =  require('./role');
//  module.exports =  require('./server');
//  module.exports =  require('./user');


 module.exports = {
    Category,
    Role,
    Server,
    User,
    Product
 }
