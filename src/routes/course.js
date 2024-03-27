const express = require('express');
const router = express.Router();
const pool = require('../configuration/database');

/// Enable BodyParser
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

router.post('', (req,res) => {
    const { courseId, courseCode, courseCat, courseName, courseDes, courseDuration, price, TeacherId, rating, status} = req.body
    pool.query(`insert into <tablerName> values (${courseId}, ${courseCode}, ${courseCat}, ${courseName}, ${courseDes}, ${courseDuration}, ${TeacherId}, ${price}, ${rating}, ${status})`, (error, results) => {
        if (error) {
            return res.status(500).json({
                message : "Missing Required Field(s)"
            })
        }
        res.status(200).json({
            message : "Course Created"
        })
    })
})

module.exports = router;