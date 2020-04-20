const express = require('express');
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
const {
    getProductById,
    createProduct,
    getProduct,
    photo,
    deleteProduct,
    updateProduct
} = require('../controllers/product');

//all of params
router.param('userId', getUserById);
router.param('productId', getProductById);

//actual routes

//create
router.post('/product/create/:userId', isSignedIn, isAuthenticated, isAdmin, createProduct);

//read
router.get('/product/:productId', getProduct);
router.get('/product/photo/:productId', photo);

//delete
router.delete('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, deleteProduct);

//update
router.put('/product/:productId/:userId', isSignedIn, isAuthenticated, isAdmin, updateProduct);

module.exports = router;
