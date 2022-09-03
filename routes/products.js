const express = require('express');
const router = express.Router();
const {detail, add, store, edit,update, remove, destroy} = require('../controllers/productsController');

const {uploadImageProduct} = require('../middlewares/upLoadFiles');

const {productsAddValidator, productsEditValidator} = require('../validations');

const adminUserCheck = require('../middlewares/adminUserCheck');

/* /products */
router
    .get('/add', adminUserCheck,add)
    .post('/add',uploadImageProduct.array('image',3),productsAddValidator,store)
    /*.post('/add',uploadImageProduct.single('image'),store)*/
    .get('/detail/:id',detail)
    .get('/edit/:id',adminUserCheck, edit)
    .put('/update/:id',productsEditValidator,update)
    .get('/delete/:id',adminUserCheck, remove)
    .delete('/destroy/:id',destroy)

module.exports = router;