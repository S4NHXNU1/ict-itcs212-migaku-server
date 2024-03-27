const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');

/// Enable Body Parser
router0.use(express.json());
router0.use(express.urlencoded({ extended: true }));

// Add routes as needed
// SAMPLE CODE
// router.get('', (req, res) => {
//     pool.query('SELECT * FROM table', (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
//       res.json(results);
//     });
//   });

router.put('/:userId', (req,res) => {
    const id = req.params.userId
    const { FirstName, LastName, Email, username, password, role } = req.body
    pool.query(`UPDATE <userTable> SET FirstName = ${FirstName}, LastName = ${LastName}, Email = ${Email}, username = ${username}, password = ${password}, role = ${role} WHERE userId = ${id}`,(error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Missing Required Field(s)' 
            });
        }
        res.status(200).json({
            message : "User Updated"
        })
    })
})

module.exports = router;