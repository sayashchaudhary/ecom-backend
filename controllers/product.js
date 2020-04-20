const Product = require('../models/product');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

exports.getProductById = (req, res, id, next) => {
    Product.findById(id)
        .populate('category')
        .exec((err, product) => {
            if (err) {
                return res.status(400).json({
                    error: 'Product not found'
                })
            }
            req.product = product;
            next()
        })
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'problem with image'
            })
        }
        //destructure the field
        const { name, description, price, category, stock } = fields;
        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ) {
            return res.status(400).json({
                error: 'please include all fields'
            })
        }

        let product = new Product(fields);

        //handling file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'file size too big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.data.contentType = file.photo.type
        }

        //save to db
        product.save((err, product) => {
            if (err) {
                return res.json({
                    error: 'saving t-shirt in db failed'
                })
            }
            res.json(product)
        })
    })
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product)
};

//middleware
exports.photo = (req, res, next) => {
    if (req.product.photo.data) {
        res.set('Content-Type', req.product.photo.contentType);
        return res.send(req.product.photo.data)
    }
    next();
};

//delete
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if (err) {
            return res.status(400).json({
                error: 'fail to delete the product'
            })
        }
        res.json({
            message: 'deletion was successful',
            deletedProduct
        })
    })
};

//update
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, file) => {
        if (err) {
            return res.status(400).json({
                error: 'problem with image'
            })
        }

        //updation
        let product = req.product;
        product = _.extend(product, fields);

        //handling file
        if (file.photo) {
            if (file.photo.size > 3000000) {
                return res.status(400).json({
                    error: 'file size too big'
                })
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.data.contentType = file.photo.type
        }

        //save to db
        product.save((err, product) => {
            if (err) {
                return res.json({
                    error: 'updation t-shirt in db failed'
                })
            }
            res.json(product)
        })
    })
};
