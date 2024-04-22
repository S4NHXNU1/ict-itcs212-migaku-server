const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const isUndefined = require('../utils/isUndefined');
const validateData = require('../utils/validateData');

router.get('', (req, res) => {
    if (!req.query) {
        return res.status(400).json({
            Message: "Missing request query param(s)"
        })
    }

    var { courseId, searchKey, courseCat, teacherName } = req.query

    if (isUndefined(courseId) || isUndefined(searchKey) || isUndefined(courseCat) || isUndefined(teacherName)) {
        return res.status(400).json({
            Message: "Missing request query param(s)"
        })
    }

    query = `SELECT c.courseId, c.courseCode, c.courseCat, c.courseName, c.courseDes, c.courseDuration, c.price, c.status, c.rating,
    CONCAT(u.FirstName, " ", u.lastName) AS teacherName FROM Courses c INNER JOIN Users u ON c.teacherId = u.userId`

    if(courseId) {
        query += ` WHERE c.courseId = ${courseId}`;
        searchKey = "";
        courseCat = "All";
        teacherName = "";
    }
    
    if (searchKey || teacherName || courseCat !== 'All') {
        query += ' WHERE '
        conditionsArr = []
        if (searchKey) {
            conditionsArr.push(`c.courseName LIKE '%${searchKey}%' OR c.courseCode LIKE '%${searchKey}%'`)
        }
        if (courseCat !== 'All') {
            conditionsArr.push(`c.courseCat = '${courseCat}'`)
        }
        if (teacherName) {
            conditionsArr.push(`CONCAT(u.firstName, " ", u.lastName) LIKE '%${teacherName}%'`)
        }
        query += conditionsArr.join(" AND ")
    }

    pool.query(query, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                Message : "Internal Server Error"
            })
        }
        if(result) {
            if(result.length === 0) return res.status(404).json({
                Message : "No courses found"
            })
            else return res.status(200).json(result)
        }
    })
})

router.post('', (req,res) => {
    const requiredBody = ["courseCode", "courseCat", "courseName", "courseDes", "courseDuration", "price", "TeacherId", "rating", "status"];
    if (!validateData(requiredBody, req.body))
        return res.status(400).json({Message: "Missing Required Field(s)"})

    const { courseCode, courseCat, courseName, courseDes, courseDuration, price, TeacherId, rating, status } = req.body;

    pool.query(`INSERT INTO Courses (courseCode, courseCat, courseName, courseDes, courseDuration, price, TeacherId, rating, status)
    VALUES ('${courseCode}', '${courseCat}', '${courseName}', '${courseDes}', '${courseDuration}', '${price}', '${TeacherId}', '${rating}', ${status})`, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                Message : "Internal Server Error"
            })
        }
        if(results) return res.status(201).json({
            Message : "Course Created"
        })
    })
})

router.put('', (req, res) => {
    const requiredBody = ["courseCode", "courseCat", "courseName", "courseDes", "courseDuration", "price", "status", "rating"]
    const requriedQuery = ["courseId"]
    if (!validateData(requiredBody, req.body) || !validateData(requriedQuery, req.query)) {
        return res.status(400).json({
            Message: "Missing required field(s)"
        })
    }
    
    const courseId = req.query.courseId
    const { courseCode, courseCat, courseName, courseDes, courseDuration, price, rating, status } = req.body;

    pool.query(`UPDATE Courses SET 
    courseCode = '${courseCode}', courseName = '${courseName}', courseDes = '${courseDes}', courseDuration = '${courseDuration}', 
    courseCat = '${courseCat}', price = '${price}', status = ${status}, rating = ${rating} 
    WHERE courseId = ${courseId}`, (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                message: 'Internal Server Error' 
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message : `No courseId ${courseId} found`
            })
        }
        else return res.status(200).json({
            Message : "Course Updated"
        })
    })
})

router.delete('', (req,res) => {
    const requriedQuery = ["courseId"]
    if(!validateData(requriedQuery, req.query))
        return res.status(400).json({Message: "Missing Required Field"});

    const courseId = req.query.courseId;
    pool.query(`DELETE FROM Courses WHERE courseId = ${courseId}`, (error,results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ 
                Message: 'Internal Server Error' 
            });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({
                Message : `No courseId ${courseId} found`
            })
        }
        else return res.status(200).json({
            Message : "Course Deleted"
        })
    })

})

module.exports = router;