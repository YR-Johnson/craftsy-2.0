const {loadUsers, storeUsers} = require('../data/db');
const {validationResult} =require('express-validator');
const bcryptjs = require('bcryptjs');

module.exports = {
     register : (req,res) => {
        return res.render('register',{
            title: 'Register'
        })
    },
    processRegister : (req,res) => {

        let errors = validationResult(req);
        if(errors.isEmpty()){
            const {name,surname,email,password,username} = req.body;
            let users = loadUsers();
    
            let newUser = {
                id : users.length > 0 ? users[users.length - 1].id + 1 : 1,
                name :name.trim(),
                surname : surname.trim(),
                email : email.trim(),
                password : bcryptjs.hashSync(password,12),
                username : username.trim(),
                rol : 'user',
                avatar : null
            }
    
            let usersModify = [...users, newUser];
    
            storeUsers(usersModify);
    
            return res.redirect('/users/login');
        }else{
            return res.render('register',{
                title: 'Register',
                errors : errors.mapped(),
                old : req.body
            })
        }
    },
    login : (req,res) => {
        return res.render('login',{
            title: 'Login'
        })
    },
    processLogin : (req,res) => {
        let errors = validationResult(req);
        if(errors.isEmpty()){

        let {id,name,username, rol, avatar} = loadUsers().find(user => user.email === req.body.email);

        req.session.userLogin ={
            id,
            username,
            name,
            rol,
            avatar
        };

        if(req.body.remember){
            res.cookie('craftsy16',req.session.userLogin,{
                maxAge : 1000 * 60
            })
        }

            return res.redirect('/')
        }else {
            return res.render('login',{
                title: 'Login',
                errors : errors.mapped()
            })
        }
    },
   
    profile : (req,res) => {
        let user = loadUsers().find(user => user.id === req.session.userLogin.id)
        return res.render('profile',{
            title: 'Profile',
            user
        })
    },
    logout : (req,res) => {
        req.session.destroy();
        res.cookie('craftsy16',null,{maxAge: -1});
        return res.redirect('/')
    }
}