const middleware = require('./middleware');
const AuthRoutes = require('../routes/auth');
const UserRoutes = require('../routes/user');
const CourseRoutes = require('../routes/course');

function setup(app)
{
    app.use(middleware);
    app.use('/api/auth', AuthRoutes);
    app.use('/api/user', UserRoutes);
    app.use('/api/course', CourseRoutes);
}

module.exports = setup