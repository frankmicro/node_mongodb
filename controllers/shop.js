const Cart = require('../models/cart');
const Product = require('../models/product');

exports.addCart = async (req, res, next) => {
    const { _id } = req.body;
    const product = await Product.findById(_id);
    if (product) {
        req.user.addToCart(product);
    }
    res.status(200).json({
        'success':true,
        'message':'add cart function',
        'user':req.user
    });
}

exports.getCart = (req, res, next) => {
    let fetchCart;
    req.user.getCart().then(cart => {
        fetchCart = cart;
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'No records found'
        });
    });
    Product.findByPk(1).then(product => {
        fetchCart.addProduct(product, {through: {
            quantity: 1
        }});
        res.status(200).json({
            'success':true,
            'data':product
        });
    }).catch();
    
}

exports.getProducts = (req, res, next) => {
    req.user.getCart().then(cart => {
        return cart.getProducts({
            where:{id:1}
        });
    }).then(products => {
        res.status(200).json({
            'success':true,
            'get-products':true,
            'data':products
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'No Products found!'
        });
    });
}

exports.deleteProducts = async (req, res, next) => {
    const { _id } = req.body;
    const product = await Product.findById(_id);
    if (product) {
        req.user.removeFromCart(product);
    } 

    res.status(200).json({
        'success':true,
        'message':'delete cart function',
        'user':req.user
    });
}