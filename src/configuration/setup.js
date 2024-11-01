const express = require('express');
const cors = require('cors');
const middleware = require('./middleware');
const AuthRoutes = require('../routes/auth');
const UserRoutes = require('../routes/user');
const CourseRoutes = require('../routes/course');

function setup(app)
{
    app.use(express.json());
    app.use(cors());
    app.use(middleware);
    app.use('/api/auth', AuthRoutes);
    app.use('/api/user', UserRoutes);
    app.use('/api/course', CourseRoutes);
    app.use((req, res, next) => {
        res.status(404).json({
            message: 'Route Not Found'
        })
    })
}

module.exports = setup