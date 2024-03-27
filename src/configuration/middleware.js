function middleware(req, res, next) {
    // Middleware logics go here
    if(req.url === '/api/auth') next();
    else
    {
        console.log('Custom Middleware');
        next();
    }
}

module.exports = middleware;