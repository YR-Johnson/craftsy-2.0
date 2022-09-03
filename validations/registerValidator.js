const {check, body} = require('express-validator');
const users = require('../data/db').loadUsers();
module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isAlpha('es-ES').withMessage('No se permite el hijo de Elon').bail()
        .isLength({
            min : 2
        }).withMessage('Como mínimo 2 caracteres'),
    check('surname')
        .notEmpty().withMessage('El apellido es obligatorio').bail()
        .isAlpha('es-ES').withMessage('Solo letras porfa!').bail()
        .isLength({
            min : 2
        }).withMessage('Como mínimo 2 caracteres'),
    check('username')
        .notEmpty().withMessage('El nombre de usuario es obligatorio').bail()
        .isLength({
            min : 6,
            max : 12
        }).withMessage('El nombre de usuario debe tener entre 6 y 12 caracteres'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio').bail()
        .isEmail().withMessage('De ser un email válido').bail()
        .custom((value, {req}) => {
            let user = users.find(user => user.email === value.trim());
           return !!!user;
        }).withMessage('El email ya se encuentra registrado'),
    check('password')
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .isLength({
            min : 6,
            max : 12
        }).withMessage('La contraseña debe tener entre 6 y 12 caracteres'),
    body('password2')
        .notEmpty().withMessage('Vuelve a reingresar tu contraseña').bail()
        .custom((value,{req}) => {
            if(value !== req.body.password ){
                return false
            }else{
                return true
            }
        }).withMessage('Las contraseñas no coinciden'),
    check('terms')
        .isString('on').withMessage('Debes aceptar las bases y condiciones')

]
