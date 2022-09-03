var express = require('express');
var router = express.Router();

const {login,register,profile, processRegister, processLogin, logout} = require('../controllers/usersController')
const {registerValidator, loginValidator} = require('../validations');

const userSessionCheck = require('../middlewares/userSessionCheck');

/* /users */
router
  .get('/register', register)
  .post('/register',registerValidator, processRegister)
  .get('/login', login )
  .post('/login',loginValidator,processLogin)
  .get('/profile',userSessionCheck, profile)
  .get('/logout',logout)

module.exports = router;
