const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('', (req, res) => {
    const username = req.body?.username;
    const password = req.body?.password;

    if(username === "" || password === "") return res.status(400).json({ Message: 'Missing Authorization Data' });

    pool.query(`SELECT username, password, userId FROM Users where username = '${username}'`, (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
      }
      if(results && results.length > 0)
      {
        if(results[0].username === username && results[0].password === password)
        {
          res.cookie("UserId", `${results[0].userId}`);
          return res.status(200).json({ 
            Authorize: true,
            UserId: `${results[0].userId}`
          });
        }
        return res.status(401).json({ Authorize: false });
      }
      return res.status(401).json({ Authorize: false });
    });
  });

module.exports = router;