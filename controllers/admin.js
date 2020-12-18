//const bcrypt = require('bcrypt');
//const dateTime = require('node-datetime');
const AdminModel = require('../models/admin');
const jwt = require('jsonwebtoken');
const {config} = require('../config');
const Product = require('../models/product');

exports.register = (req, res, next) => {
    const {name, email, password} = req.body;
    //let dt = dateTime.create();
    //let formated = dt.format('Y-m-d h:i:s')
    res.status(200).json({
        'success':true,
        'date':formated
    });
}

exports.login = (req, res, next) => {
    var errors =  checkValidation(req, 'login');
    if (errors) {
        res.status(400).send({ "message": "Missing parameter" });
    }
    const users = {
        "username":"john",
        "password":123456
    };
    const {email, password} = req.body;

    AdminModel.findAll({
        where:{email:email, password:password}
    }).then(user =>{
        if (user.length > 0) {
        } else {
            res.status(401).json({
                'success':false,
                'message':'Invalid Credentials'
            });
        }
    }).then(storeUser => {
        jwt.sign({user:storeUser}, config.secretkey, (err, token) => {
            res.json({
                token,
            });
        });
    }).catch(err =>{
        console.log(err);
    });
}

checkValidation = (req, method) => {
    switch (method) {
        case 'login':
            req.checkBody("email", "Invalid company").notEmpty();        
            break;
    
        default:
            break;
    }
}

exports.getAdmin = (req, res, next) => {
    const admin = new AdminModel(req.params.name);
    console.log(req.authData);
    res.status(200).json({
        name:req.params.name,
        date: new Date().toLocaleDateString().split('/').reverse().join('-')
    });
    //res.send(`<h1>Admin is ${name}</h1>`);
}

exports.postAddProduct = (req, res, next) => {
        const title='new one';
        const price= 42;
        const imageUrl = 'https://www.google.com/search?q=product+images&source=lnms&tbm=isch&sa=X&ved=2ahUKEwid5rWs0MHtAhUJzjgGHQdXCWYQ_AUoAXoECBwQAw&biw=1853&bih=981';
        const description = 'first new product';

        const product = new Product({
            title: title,
            price: price,
            description: description,
            imageUrl: imageUrl,
            userId: req.user
        });
        product
        .save()
        .then(result => {
            res.status(200).json({
                'success':true,
                'data':product,
                'message':'Product saved successfully!'
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                'success':false,
                'message':'Something went wrong!'
            });
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
    .select('title price -_id')
   // .populate('userId','name')
    .then(products => {
        res.status(200).json({
            'success':true,
            'data':products
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId.toString();
    if (prodId.match(/^[0-9a-fA-F]{24}$/)) {
        Product.findById(prodId).then(product => {
            res.status(200).json({
                'success':true,
                'data':product
            });
        }).catch(err => {
            console.log(err);
        });    
    } else {
        console.log("not match");
    }
}

exports.putUpdateProduct = (req, res, next) => {
    const prodId = req.params.productId.toString();
    const title='new onesssssss';
        const price= 420;
        const imageUrl = 'https://www.google.com/search?q=product+images&source=lnms&tbm=isch&sa=X&ved=2ahUKEwid5rWs0MHtAhUJzjgGHQdXCWYQ_AUoAXoECBwQAw&biw=1853&bih=981';
        const description = 'firstsss';

    if (prodId.match(/^[0-9a-fA-F]{24}$/)) {
        Product.findById(prodId).then(product => {
            product.title = title;
            product.price = price;
            product.description = description;
            product.imageUrl = imageUrl;
            product.save();
            res.status(200).json({
                'success':true,
                'data':product
            });
        }).catch(err => {
            console.log(err);
        });    
    } else {
        console.log("not match");
    }
}

exports.deleteProducts = (req, res, next) => {
    const prodId = req.params.productId;
    if (prodId.match(/^[0-9a-fA-F]{24}$/)) {
        Product.findByIdAndRemove(prodId).then(result => {
            res.status(200).json({
                'success':true,
                'message':'Deleted Successfully!'
            });
        }).catch(err => {
            res.status(400).json({
                'success':false,
                'message':'Something went wrong!'
            });
        });
    }
}
