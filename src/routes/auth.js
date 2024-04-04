const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const isUndefined = require('../utils/isUndefined');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('', (req, res) => {

  if(isUndefined(req.body)) return res.status(400).json({ Message: 'Missing Authorization Data' });

  const username = req.body.username;
  const password = req.body.password;

  if(isUndefined(username) || isUndefined(password) || username === "" || password === "")
    return res.status(400).json({ Message: 'Missing Authorization Data' });

  pool.query(`SELECT username, password, userId, role FROM Users where username = '${username}' LIMIT 1`, (error, results) => {
    if (error){
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
    if(results && results.length > 0)
    {
      if(results[0].username === username && results[0].password === password)
      {
        // Unused
        // res.cookie("UserId", `${results[0].userId}`);
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

// Unused
// router.get('/logout', (req, res) => {
//   const cookie = req.cookies["UserId"];
//   if(cookie)
//   {
//     console.log(cookie);
//     res.clearCookie('UserId');
//     return res.status(200).json({ Message: "Logout Complete" });
//   }
//   else res.status(400).json({ Message: "No session is set"});
// });

module.exports = router;