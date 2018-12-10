// Express is required
const express = require('express');

// Here we initiate Express
const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        message: 'OK!'
    });
});

module.exports = app;