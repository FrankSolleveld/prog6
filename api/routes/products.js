// Require express
const express = require('express');
// We use the Router function provided by express. It is initialized right here
const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({
        message:'Handling GET requests to /products'
    });
});

// URI /products is already defined in app.js temporarily, hence we use '/' here 
router.post('/', (req, res, next) => {
    res.status(201).json({
        message:'Handling POST requests to /products'
    });
});

// URI /products/productId -> check Postman
router.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    if (id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id: id
        });
    } else {
        res.status(200).json({
            message: 'You passed an ID',
            id: id
        })
    }
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product'
    })
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    })
});
module.exports = router;