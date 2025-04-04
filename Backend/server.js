const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

require('dotenv').config();  


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('uploads'));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ storage });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("MongoDB connection error:", err));

const CareerApplicationSchema = new mongoose.Schema({
  name: String, mobileNumber: String, email: String, qualification: String,
  experience: String, prevCompany: String, Designation: String, domain: String,
  relocate: String, skills: String, resume: String, coverLetter: String,
  submittedAt: { type: Date, default: Date.now }
}, { collection: 'careerapplications' });

const CareerApplication = mongoose.model('CareerApplication', CareerApplicationSchema);

app.post('/api/career', upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'coverLetter', maxCount: 1 }]), async (req, res) => {
  try {
    const { name, mobileNumber, email, qualification, experience, prevCompany, Designation, domain, relocate, skills } = req.body;
    if (!req.files?.resume) return res.status(400).json({ error: 'Resume file is required.' });
    
    const newApplication = new CareerApplication({
      name, mobileNumber, email, qualification, experience, prevCompany,
      Designation, domain, relocate, skills, resume: req.files.resume[0].path,
      coverLetter: req.files.coverLetter?.[0]?.path || ''
    });

    await newApplication.save();
    res.json({ message: 'Application submitted successfully.' });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

const CourseEnquirySchema = new mongoose.Schema({
  fullName: String, email: String, phone: String, course: String,
  termsAccepted: Boolean, submittedAt: { type: Date, default: Date.now }
}, { collection: 'courseenquiries' });

const CourseEnquiry = mongoose.model('CourseEnquiry', CourseEnquirySchema);

app.post('/api/course-enquiry', async (req, res) => {
  try {
    const { fullName, email, phone, course, termsAccepted } = req.body;
    if (!fullName || !email || !phone || !course || !termsAccepted)
      return res.status(400).json({ error: 'Missing required fields or terms not accepted.' });

    const newEnquiry = new CourseEnquiry({ fullName, email, phone, course, termsAccepted });
    await newEnquiry.save();
    res.json({ message: 'Course enquiry submitted successfully.' });
  } catch (err) {
    console.error('Error saving course enquiry:', err);
    res.status(500).json({ error: 'Failed to submit course enquiry.' });
  }
});

const testimonialSchema = new mongoose.Schema({
  image: String, name: String, feedback: String, role: String,
  rating: Number, submittedAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

app.post('/api/testimonials', upload.single('image'), async (req, res) => {
  try {
    const { name, feedback, role, rating } = req.body;
    if (!name || !feedback || !role || !rating)
      return res.status(400).json({ error: 'All fields except image are required.' });

    const newTestimonial = new Testimonial({
      image: req.file?.filename || '', name, feedback, role, rating
    });
    await newTestimonial.save();
    res.json({ message: 'Testimonial submitted successfully.' });
  } catch (error) {
    console.error('Error saving testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});

app.get('/api/testimonials', async (req, res) => {
  try {
    res.json(await Testimonial.find().sort({ submittedAt: -1 }));
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

