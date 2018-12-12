// Require express
const express = require('express');
// We use the Router function provided by express. It is initialized right here
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
        .select('name price category _id')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        category: doc.category,
                        price: doc.price,
                        _id: doc._id,
                        // Lecturer called this below '_links'
                        request: {
                            type: 'GET',
                            url: 'http://localhost:80/products/' + doc._id
                        }
                    }
                })
            };
            if (docs.length >= 0) {
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: "No entries found."
                });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// URI /products is already defined in app.js temporarily, hence we use '/' here 
router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }); 
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully.',
                createdProduct: {
                    name: result.name,
                    category: result.category,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:80/products/' + result._id
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });

});

// URI /products/productId -> check Postman
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .select('name category price _id')
        .exec()
        .then(doc => {
            console.log("From db: " + doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request:{
                        type:'GET',
                        url: 'http://localhost:80/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: 'Invalid entry for provided ID.'
                });
            };
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // This will have the data that needs to be patched. In the for loop the data is being retrieved from the body and put in the empty model updateOps.
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url:'http://localhost:80/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

/*
How to PATCH:
[
	{"propName":"name", "value":"Harry Potter 6"}	
]
*/

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request:{
                    type:'POST',
                    url:'http://localhost:80/products',
                    body:{
                        name:'String', category:'String', price:'String'
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});
module.exports = router;