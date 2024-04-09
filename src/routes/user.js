const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const isUndefined = require('../utils/isUndefined');

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

router.post('', (req, res) => {
    query = req.body;
    if (!query) return res.status(400).json({Message: "Missing request body"})
    const { username, password, email, firstName, lastName, role } = query;
    if (!username || !password || !email || !firstName || !lastName || !role ) return res.status(400).json({Message: "Incomplete field(s)"})  
    
    pool.query
    (`INSERT INTO Users (username, password, email, firstName, lastName, role)
    VALUES ('${username}', '${password}', '${email}', '${firstName}', '${lastName}', '${role}');`, 
    (error) => {
        if (error) {
            console.log(error)
            return res.status(500).json({Message: 'Internal Server Error'})
        }
        return res.status(201).json({Message: "User Created"})
    })
})

router.put('', (req,res) => {
    if (isUndefined(req.query) || req.query === "")
        return res.status(400).json({Message: "Missing Required Field(s)"})

    const id = parseInt(req.query.userId)
    
    if (isUndefined(req.body) || req.body === "")
        return res.status(400).json({Message: "Missing Required Field(s)"})

    const { FirstName, LastName, Email, username, password, role } = req.body

    if (isUndefined(FirstName) || isUndefined(LastName) || isUndefined(Email) || isUndefined(username) || isUndefined(password) || isUndefined(role) ||
    FirstName === "" || LastName === "" || Email === "" || username === "" || password === "" || role === "")
        return res.status(400).json({Message: "Missing Required Field(s)"})

    pool.query(`UPDATE Users 
                SET FirstName = '${FirstName}', LastName = '${LastName}', Email = '${Email}', username = '${username}', password = '${password}', role = '${role}' 
                WHERE userId = ${id}`,(error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                Message: 'Internal Server Error' 
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message : `No userId ${userId} found`
            })
        }
        res.status(200).json({
            Message : "User Updated"
        })
    })
})

router.delete('', (req,res) => {

    if(isUndefined(req.query) || req.query === "" || isUndefined(req.query.userId) || req.query.userId === "")
    return res.status(400).json({Message: "Missing Required Field"});

    const userId = req.query.userId;
    pool.query(`DELETE FROM Users WHERE userId = ${userId}`, (error,results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                Message: 'Internal Server Error' 
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message : `No userId ${userId} found`
            })
        }
        else return res.status(200).json({
            Message : "User Deleted"
        })
    })

})

module.exports = router;