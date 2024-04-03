const pool = require('../configuration/database');

function middleware(req, res, next) {
    // Middleware logics go here
    if(req.url === '/api/auth' || req.url === '/api/auth/logout') next();
    else
    {
        //console.log('Custom Middleware');
        if(req.headers === undefined || req.headers.authorization === "" || req.headers.authorization === undefined)
            return res.status(400).json({ Message: "There’s no authorization header attached" });
        const userId = req.headers.authorization;
        pool.query(`SELECT userId FROM Users WHERE userId = '${userId}' LIMIT 1`, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if(results && results.length > 0)
            {
                //console.log(results)
                if(results[0].userId === Number(userId)) next();
                else return res.status(403).json({ Message: "Invalid User Id" });
            }
            else return res.status(403).json({ Message: "Invalid User Id" });
        });
    }
}

module.exports = middleware;