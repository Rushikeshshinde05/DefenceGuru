const express = require('express');
const router = express.Router();
const { createCourseEnquiry } = require('../controllers/courseEnquiryController');

router.post('/course-enquiry', createCourseEnquiry);

module.exports = router;
