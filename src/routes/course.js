const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const isUndefined = require('../utils/isUndefined');

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

router.put('', (req, res) => {
    if (isUndefined(req.body)) {
        return res.status(400).json({
            Message: "Missing request body"
        })
    }

    courseCode = req.body?.courseCodey
    courseCat = req.body?.courseCat
    courseName = req.body?.courseName
    courseDes = req.body?.courseDes
    courseDuration = req.body?.courseDuration
    price = req.body?.price
    courseStatus = req.body?.status
    rating = req.body?.rating
    teacherId = req.body?.teacherId
    

    if (isUndefined(searchKey) || isUndefined(courseCat) || isUndefined(teacherName)) {
        return res.status(400).json({
            Message: "Bad request"
        })
    }
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