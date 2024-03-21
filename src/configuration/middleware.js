function middleware(req, res, next) {
    // Middleware logics go here
    console.log('Custom Middleware');
    next();
}

module.exports = middleware;