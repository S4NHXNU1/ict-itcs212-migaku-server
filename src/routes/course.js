const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const isUndefined = require('../utils/isUndefined');
const isEmpty = require('../utils/isEmpty')

/// Enable BodyParser
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Add routes as needed
// SAMPLE CODE
// router.get('', (req, res) => {
//     pool.query('SELECT * FROM Courses', (error, results) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal Server Error' });
//       }
//       res.json(results);
//     });
//   });

router.get('', (req, res) => {
    if (isUndefined(req.body)) {
        return res.status(400).json({
            Message: "Missing request body"
        })
    }

    searchKey = req.body?.searchKey
    courseCat = req.body?.courseCat
    teacherName = req.body?.name

    if (isUndefined(searchKey) || isUndefined(courseCat) || isUndefined(teacherName)) {
        return res.status(400).json({
            Message: "Bad request"
        })
    }

    query = `SELECT c.courseId, c.courseCode, c.courseCat, c.courseName, c.courseDes, c.courseDuration, c.price, c.status, c.rating 
    FROM Courses c INNER JOIN Users u ON c.teacherId = u.userId`
    
    if (!isEmpty(searchKey) || !isEmpty(teacherName) || courseCat !== 'All') {
        query += ' WHERE '
        conditionsArr = []
        if (!isEmpty(searchKey)) {
            conditionsArr.push(`c.courseName LIKE '%${searchKey}%'`)
        }
        if (courseCat !== 'All') {
            conditionsArr.push(`c.courseCat = '${courseCat}'`)
        }
        if (!isEmpty(teacherName)) {
            conditionsArr.push(`CONCAT(u.firstName, " ", u.lastName) LIKE '%${teacherName}%'`)
        }
        query += conditionsArr.join(" AND ")
    }
    
    //console.log(query)

    pool.query(query, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                Message : "Internal Server Error"
            })
        }

        if (result) {
            return res.status(200).json(result)
        }
    })
})

router.get('/teacher', (req, res) => {
    if (isUndefined(req.body)) {
        return res.status(400).json({
            Message: "Missing request body"
        })
    }

    teacherId = req.body?.userId

    if (isUndefined(teacherId)) {
        return res.status(400).json({
            Message: "Bad request"
        })
    }

    query = `SELECT * from Courses WHERE teacherId = ${teacherId}`

    pool.query(query, (error, result) => {
        if (error) {
            console.log(error)
            return res.status(500).json({
                Message : "Internal Server Error"
            })
        }

        if (result) {
            return res.status(200).json(result)
        }
    })
})

router.post('', (req,res) => {

    if (isUndefined(req.body) || req.body === "")
        return res.status(400).json({Message: "Missing Required Field(s)"})

    const { courseCode, courseCat, courseName, courseDes, courseDuration, price, TeacherId, rating, status } = req.body;

    if(courseCode === "" || courseCat === "" || courseName === "" || courseDes === "" || courseDuration === "" ||
    price === "" || TeacherId === "" || rating === "" || status === "")
        return res.status(400).json({Message: "Missing Required Field(s)"})
    
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

router.delete('', (req,res) => {

    if(isUndefined(req.query) || req.query === "" || isUndefined(req.query.courseId) || req.query.courseId === "")
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