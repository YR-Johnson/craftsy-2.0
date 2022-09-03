const fs = require('fs');
const path = require('path');

const products = require('../data/products.json');
const brands = require('../data/brands.json');

const {validationResult} = require('express-validator');

module.exports = {
    detail : (req,res) => {

        const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json')));

        const {id} = req.params;
        let product = products.find(product => product.id === +id)

        return res.render('productDetail',{
            title : 'Detalle',
            product
        })
    },
    add : (req,res) => {
        return res.render('productAdd',{
            brands : brands.sort()
        })
    },
    store : (req,res) => {

        const errors = validationResult(req);
        if(errors.isEmpty()){
              let {title, price,discount, description, brand, section} = req.body;

                let images = req.files.map(file => file.filename);

                let newProduct = {
                    id : products[products.length - 1].id + 1,
                    ...req.body,
                title : title.trim(),
                description : description.trim(),
                price : +price,
                discount : +discount,
                images
                }

                let productsNew = [...products, newProduct];

                fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'),JSON.stringify(productsNew,null,3),'utf-8');    
                return res.redirect('/products/detail/' + newProduct.id);
        }else {
            return res.render('productAdd',{
                brands : brands.sort(),
                errors : errors.mapped(),
                old : req.body
            })
        }

      

    },
    edit : (req,res) => {

        const {id} = req.params;
        let product = products.find(product => product.id === +id)

        return res.render('productEdit',{
            product,
            brands
        })
    },
    update : (req,res) => {
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json')));

        const errors = validationResult(req);

        if(errors.isEmpty()){
            const {id} = req.params;
            let {title, price,discount, description, brand, section} = req.body;
    

            const productModify = products.map(product => {
                if(product.id === +id){
                    return {
                        ...product,
                        title : title.trim(),
                        description : description.trim(),
                        price : +price,
                        discount : +discount,
                        brand,
                        section
                    }
                }else{
                    return product
                }
            })
    
            fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'),JSON.stringify(productModify,null,3),'utf-8');    
            return res.redirect('/products/detail/' + id);
        }else{
            return res.render('productEdit',{
                product : req.body,
                id : req.params.id,
                brands,
                errors : errors.mapped()
            })
        }
    },
    remove : (req,res) => {
        return res.render('confirm', {
            id : req.params.id
        })
    },
    destroy : (req,res) => {

        const {id} = req.params;
        const products = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'products.json')));

        const productFilter = products.filter(product => product.id !== +id);

        fs.writeFileSync(path.join(__dirname, '..', 'data', 'products.json'),JSON.stringify(productFilter,null,3),'utf-8');    
        return res.redirect('/');

    }
}