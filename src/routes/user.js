const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const validateData = require('../utils/validateData');

router.get('', (req,res) => {
    var query = "SELECT * FROM Users ORDER BY userId";
    pool.query(query, function(error, data){
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                Message: 'Internal Server Error' 
            });
        }
        if(data.length === 0)
            return res.status(404).json({
                Message : "No user(s) found"
            });
        else return res.status(200).json(data);
    })
})

router.post('', (req, res) => {
    const requiredBody = ["username", "password", "email", "firstName", "lastName", "role"];
    if (!validateData(requiredBody, req.body)) return res.status(400).json({Message: "Missing request body"})

    const { username, password, email, firstName, lastName, role } = req.body;

    pool.query(`INSERT INTO Users (username, password, email, firstName, lastName, role)
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
    const requriedQuery = ["userId"]
    const requiredBody = ["firstName", "lastName", "email", "username", "password", "role"];
    if (!validateData(requriedQuery, req.query) || !validateData(requiredBody, req.body))
        return res.status(400).json({Message: "Missing Required Field(s)"})

    const userId = parseInt(req.query.userId)
    const { firstName, lastName, email, username, password, role } = req.body

    pool.query(`UPDATE Users 
                SET FirstName = '${firstName}', LastName = '${lastName}', Email = '${email}', username = '${username}', password = '${password}', role = '${role}' 
                WHERE userId = ${userId}`,(error, results) => {
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
    const requriedQuery = ["userId"]
    if(!validateData(requriedQuery, req.query))
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