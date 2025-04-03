const CourseEnquiry = require('../models/CourseEnquiry');

const createCourseEnquiry = async (req, res) => {
  try {
    const { fullName, email, phone, course, termsAccepted } = req.body;

    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the Terms & Conditions.' });
    }

    const newEnquiry = new CourseEnquiry({
      fullName,
      email,
      phone,
      course,
      termsAccepted,
    });

    const savedEnquiry = await newEnquiry.save();
    res.json({ message: 'Course enquiry submitted successfully.', enquiry: savedEnquiry });
  } catch (err) {
    console.error('Error saving course enquiry:', err);
    res.status(500).json({ error: 'Failed to submit course enquiry.' });
  }
};

module.exports = { createCourseEnquiry };
