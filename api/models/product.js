const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // All is required to provide as much information as possible about the product.
    name: {type:String, required:true},
    price: {type: String, required:true},
    category:{type: String, required:true}
});

module.exports = mongoose.model('Product', productSchema);