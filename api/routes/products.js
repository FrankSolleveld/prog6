// Require express
const express = require('express');
// We use the Router function provided by express. It is initialized right here
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

const ipAddress = 'https://kefcorp.xyz'

router.get('/', (req, res, next) => {
    Product.find()
        .select('_id name price category')
        .exec()
        .then(docs => {
            const response = {

                items: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        category: doc.category,
                        price: doc.price,
                        _links: {
                            self: { 
                                'href': ipAddress + '/products/' + doc._id 
                            },
                            collection: { 
                                'href': ipAddress + '/products' 
                            }
                        }
                    }
                }),
                _links: {
                    self: { 
                        'href': ipAddress + '/products/' 
                    }
                },
                pagination: 'does not wurk'
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
    if (req.body.name == null || req.body.category == null || req.body.price == null) {
        return res.status(400).json({
            Error: 'All fields are supposed to be filled'
        });
    }
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
                name: result.name,
                category: result.category,
                price: result.price,
                _id: result._id,
                _links: {
                    self: { 'href': ipAddress + '/products/' + result._id  },
                    collection: { 'href': ipAddress + '/products/' }
                }
            })
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
                    name: doc.name,
                    category: doc.category,
                    price: doc.price,
                    _id: doc._id,
                    // Lecturer called this below '_links'
                    _links: {
                        self: { 'href': ipAddress + '/products/' + doc._id },
                        collection: { 'href': ipAddress + '/products/' }
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

router.put('/:productId', function (req, res) {
    const id = req.params.productId;

    Product.update({ _id: id }, {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        _id: id
    }, { runValidators: true })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                name: req.body.name,
                category: req.body.category,
                price: req.body.price,
                _id: id,
                message: 'Product updated',
                _links: {
                    self: { 'href': ipAddress + '/products/' + doc._id },
                    collection: { 'href': ipAddress + '/products/'}
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                error: err
            });
        });

});

router.delete('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(204).json({
                message: 'Product deleted'
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