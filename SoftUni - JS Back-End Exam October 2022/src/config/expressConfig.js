const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const { auth } = require('../middlewares/authMiddleware');

function expressConfig(app) {
    app.locals.title = 'SoftUni Exam'
    app.use(express.static(path.join(__dirname, '../static')));
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(auth);
}

module.exports = expressConfig;