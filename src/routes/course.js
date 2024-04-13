const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');
const isUndefined = require('../utils/isUndefined');
const validateData = require('../utils/validateData');

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
    if (isUndefined(req.query)) {
        return res.status(400).json({
            Message: "Missing request query param(s)"
        })
    }

    courseId = req.query?.courseId
    searchKey = req.query?.searchKey
    courseCat = req.query?.courseCat
    teacherName = req.query?.teacherName

    if (isUndefined(courseId) ||isUndefined(searchKey) || isUndefined(courseCat) || isUndefined(teacherName)) {
        return res.status(400).json({
            Message: "Missing request query param(s)"
        })
    }

    query = `SELECT c.courseId, c.courseCode, c.courseCat, c.courseName, c.courseDes, c.courseDuration, c.price, c.status, c.rating 
    FROM Courses c INNER JOIN Users u ON c.teacherId = u.userId`

    if(!isEmpty(courseId)) {
        query += ` WHERE c.courseId = ${courseId}`;
        searchKey = "";
        courseCat = "All";
        teacherName = "";
    }
    
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
        if(result) {
            if(result.length === 0) return res.status(404).json({
                Message : "No courses found"
            })
            else return res.status(200).json(result)
        }
    })
})

// router.get('/detail', (req, res) => {
//     if (isUndefined(req.query)) {
//         return res.status(400).json({
//             Message: "Missing request query"
//         })
//     }

//     courseId = req.query?.courseId

//     if (isUndefined(courseId)) {
//         return res.status(400).json({
//             Message: "Bad request"
//         })
//     }

//     query = `SELECT * From Courses WHERE courseId = ${courseId}`
    
//     pool.query(query, (error, result) => {
//         if (error) {
//             console.log(error)
//             return res.status(500).json({
//                 Message : "Internal Server Error"
//             })
//         }

//         if (result) {
//             return res.status(200).json(result)
//         }
//     })
// })

// router.get('/teacher', (req, res) => {
//     if (isUndefined(req.body)) {
//         return res.status(400).json({
//             Message: "Missing request body"
//         })
//     }

//     teacherId = req.body?.userId

//     if (isUndefined(teacherId)) {
//         return res.status(400).json({
//             Message: "Bad request"
//         })
//     }

//     query = `SELECT * from Courses WHERE teacherId = ${teacherId}`

//     pool.query(query, (error, result) => {
//         if (error) {
//             console.log(error)
//             return res.status(500).json({
//                 Message : "Internal Server Error"
//             })
//         }

//         if (result) {
//             return res.status(200).json(result)
//         }
//     })
// })

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