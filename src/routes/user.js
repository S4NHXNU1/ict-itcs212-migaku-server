const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');

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

router.put('', (req,res) => {
    if (req.query === "") {
        res.status(400).json({Message: "Missing Required Field(s)"})
    }

    const id = parseInt(req.query.userId)
    
    if (req.body === "") {
        res.status(400).json({Message: "Missing Required Field(s)"})
    }

    const { FirstName, LastName, Email, username, password, role } = req.body

    if (FirstName === "" || LastName === "" || Email === "" || username === "" || password === "" || role === "") {
        res.status(400).json({Message: "Missing Required Field(s)"})
    }

    pool.query(`UPDATE Users 
                SET FirstName = '${FirstName}', LastName = '${LastName}', Email = '${Email}', username = '${username}', password = '${password}', role = '${role}' 
                WHERE userId = ${id}`,(error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal Server Error' 
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({
                message : "No userId found"
            })
        }
        res.status(200).json({
            message : "User Updated"
        })
    })
})

module.exports = router;