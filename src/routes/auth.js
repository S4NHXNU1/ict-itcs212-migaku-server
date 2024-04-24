const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const validateData = require('../utils/validateData');

router.post('', (req, res) => {

  const requiredBody = ["username", "password"];
  if(!validateData(requiredBody, req.body)) return res.status(400).json({ Message: 'Missing Authorization Data' });

  const username = req.body.username;
  const password = req.body.password;

  pool.query(`SELECT username, password, userId, role FROM Users WHERE username = '${username}' AND password = '${password}' LIMIT 1`, (error, results) => {
    if (error){
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if(results && results.length > 0)
    {
      if(results[0].username === username && results[0].password === password)
      {
        return res.status(200).json({ 
          Authorize: true,
          UserId: `${results[0].userId}`,
          Role: `${results[0].role}`
        });
      }
      return res.status(401).json({ Authorize: false });
    }
    return res.status(401).json({ Authorize: false });
  });
});

module.exports = router;