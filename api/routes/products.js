// Require express
const express = require('express');
// We use the Router function provided by express. It is initialized right here
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
    .exec()
    .then(docs => {
        console.log(docs);
        if (docs.length>=0){
            res.status(200).json(docs);
        } else {
            res.status(404).json({
                message: "No entries found."
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error:err
        })
    });
});

// URI /products is already defined in app.js temporarily, hence we use '/' here 
router.post('/', (req, res, next) => {
    console.log('iets zeggen');
    Product.create({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    }).then(function(product){
        product.save().then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));
        res.status(201).json({
            message:'Handling POST requests to /products',
            createdProduct: result
        });
    }).catch(err =>{
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
    .exec()
    .then(doc => {
        console.log("From db: " + doc);
        if(doc){
            res.status(200).json(doc);
        } else {
            res.status(404).json({
                message: 'Invalid entry for provided ID.'
            });
        };
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
});

router.patch('/:productId', (req, res, next) => {
    const id = req.params.productId;
    // This will have the data that needs to be patched. In the for loop the data is being retrieved from the body and put in the empty model updateOps.
    const updateOps = {};
    for (const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id: id}, { $set:updateOps })
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json(result);
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
    Product.remove({_id: id})
    .exec()
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
module.exports = router;