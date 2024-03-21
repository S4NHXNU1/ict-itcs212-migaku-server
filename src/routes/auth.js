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

module.exports = router;