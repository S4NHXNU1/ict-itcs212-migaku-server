const pool = require('../configuration/database');
const validateData = require('../utils/validateData');

function middleware(req, res, next) {
    if(req.url === '/api/auth' || (req.method === "GET" && req.url.includes('/api/course'))) next();
    else
    {
        const requiredHeader = ["authorization"];
        if(!validateData(requiredHeader, req.headers))
            return res.status(400).json({ Message: "There’s no authorization header attached" });
        const userId = req.headers.authorization;
        pool.query(`SELECT userId FROM Users WHERE userId = '${userId}' LIMIT 1`, (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            if(results && results.length > 0)
            {
                if(results[0].userId === Number(userId)) next();
                else return res.status(403).json({ Message: "Invalid User Id" });
            }
            else return res.status(403).json({ Message: "Invalid User Id" });
        });
    }
}

module.exports = middleware;