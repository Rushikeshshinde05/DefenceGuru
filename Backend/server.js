const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');  // Optional: for cross-origin requests
const multer = require('multer');  // Import multer for handling file uploads
const path = require('path');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vaishnavichandar2019@gmail.com',
    pass: 'gkuo ipqe taao iryh'  // Use App Password for Gmail, not your real password
  }
});

// Initialize Express
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());  // Allow cross-origin requests
app.use(express.static('uploads'));  // Serve uploaded files from the 'uploads' folder

// Set up Multer storage engine for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Save files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Save files with a timestamp to avoid conflicts
  },
});

const upload = multer({ storage: storage });

// Connect to MongoDB (using the DGuru database)
mongoose.connect('mongodb://localhost:27017/DGuru', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB (DGuru database)"))
  .catch(err => console.log("MongoDB connection error:", err));

// Mongoose Schema for Career Application
const CareerApplicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true },
  qualification: { type: String, required: true },
  experience: { type: String, required: true },
  prevCompany: { type: String, required: true },
  Designation: { type: String, required: true },
  domain: { type: String, required: true },
  relocate: { type: String, required: true },
  skills: { type: String, required: true },
  resume: { type: String, required: true },
  coverLetter: { type: String },  // Optional
  submittedAt: { type: Date, default: Date.now },
}, { collection: 'careerapplications' });  // Specify the collection name

const CareerApplication = mongoose.model('CareerApplication', CareerApplicationSchema);

// API Endpoint for the Career Form

app.post('/api/career', upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]), async (req, res) => {
  try {
    const {
      name,
      mobileNumber,
      email,
      qualification,
      experience,
      prevCompany,
      Designation,
      domain,
      relocate,
      skills
    } = req.body;

    if (!req.files || !req.files.resume || req.files.resume.length === 0) {
      return res.status(400).json({ error: 'Resume file is required.' });
    }

    const resumePath = req.files.resume[0].path;
    const coverLetterPath = req.files.coverLetter ? req.files.coverLetter[0].path : '';

    const newApplication = new CareerApplication({
      name,
      mobileNumber,
      email,
      qualification,
      experience,
      prevCompany,
      Designation,
      domain,
      relocate,
      skills,
      resume: resumePath,
      coverLetter: coverLetterPath,
    });

    const savedApplication = await newApplication.save();

    // ✅ Use the existing transporter and replyTo for user's email
    const mailOptions = {
      from: 'vaishnavichandar2019@gmail.com',             // Your configured Gmail
      to: 'vaishnavichandar2019@gmail.com',               // Admin will receive this email
      replyTo: email,                                     // User’s email shown in reply-to
      subject: 'New Career Application Submitted',
      html: `
        <h2>New Career Application Received</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mobile Number:</strong> ${mobileNumber}</p>
        <p><strong>Qualification:</strong> ${qualification}</p>
        <p><strong>Experience:</strong> ${experience}</p>
        <p><strong>Previous Company:</strong> ${prevCompany}</p>
        <p><strong>Designation:</strong> ${Designation}</p>
        <p><strong>Domain:</strong> ${domain}</p>
        <p><strong>Willing to Relocate:</strong> ${relocate}</p>
        <p><strong>Skills:</strong> ${skills}</p>
        <p><strong>Resume:</strong> Attached</p>
        ${coverLetterPath ? '<p><strong>Cover Letter:</strong> Attached</p>' : ''}
      `,
      attachments: [
        { filename: 'Resume.pdf', path: resumePath },
        ...(coverLetterPath ? [{ filename: 'CoverLetter.pdf', path: coverLetterPath }] : [])
      ]
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send failed:', error);
      } else {
        console.log('Career application email sent:', info.response);
      }
    });

    res.json({ message: 'Application submitted successfully.', application: savedApplication });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});





// Mongoose Schema and Model for Course Enquiry
const CourseEnquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now }
}, { collection: 'courseenquiries' });  // Specify the collection name

const CourseEnquiry = mongoose.model('CourseEnquiry', CourseEnquirySchema);

// API Endpoint for Course Enquiry
app.post('/api/course-enquiry', async (req, res) => {
  try {
    const { fullName, email, phone, course, termsAccepted } = req.body;

    // Basic validation
    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    if (!termsAccepted) {
      return res.status(400).json({ error: 'You must accept the Terms & Conditions.' });
    }

    // Save to MongoDB
    const newEnquiry = new CourseEnquiry({
      fullName,
      email,
      phone,
      course,
      termsAccepted
    });

    const savedEnquiry = await newEnquiry.save();

    // ✅ Email to admin using existing transporter
    const mailOptions = {
      from: 'vaishnavichandar2019@gmail.com',             // Your authenticated Gmail
      to: 'vaishnavichandar2019@gmail.com',               // Admin receives the enquiry
      replyTo: email,                                     // User's email (admin can reply)
      subject: 'New Course Enquiry Received',
      html: `
        <h2>Course Enquiry Details</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Selected Course:</strong> ${course}</p>
        <p><strong>Terms Accepted:</strong> ${termsAccepted ? 'Yes' : 'No'}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending course enquiry email:', error);
      } else {
        console.log('Course enquiry email sent:', info.response);
      }
    });

    res.json({ message: 'Course enquiry submitted successfully.', enquiry: savedEnquiry });
  } catch (err) {
    console.error('Error saving course enquiry:', err);
    res.status(500).json({ error: 'Failed to submit course enquiry.' });
  }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneCode: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true }
});

// Contact Model
const Contact = mongoose.model('Contact', contactSchema);

// API route for saving contact data
app.post('/api/contact', async (req, res) => {
  const { fullName, email, phoneCode, phone, message, termsAccepted } = req.body;

  const newContact = new Contact({
    fullName,
    email,
    phoneCode,
    phone,
    message,
    termsAccepted
  });

  try {
    await newContact.save();

    // ✅ Send email with contact details
    const mailOptions = {
      from: 'vaishnavichandar2019@gmail.com',          // Your authenticated Gmail
      to: 'vaishnavichandar2019@gmail.com',            // Admin receives the form
      replyTo: email,                                  // Admin can reply to the user directly
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> +${phoneCode}-${phone}</p>
        <p><strong>Message:</strong><br/> ${message}</p>
        <p><strong>Terms Accepted:</strong> ${termsAccepted ? 'Yes' : 'No'}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending contact email:', error);
      } else {
        console.log('Contact form email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Contact information saved and email sent successfully' });
  } catch (err) {
    console.error('Error saving contact information:', err);
    res.status(500).json({ message: 'Error saving contact information', error: err });
  }
});



// Schema for the Learning Support Desk form
const supportRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  queryCategory: { type: String, required: true },
  description: { type: String, required: true },
  attachments: { type: [String], required: false }, // Array for multiple files
  submittedAt: { type: Date, default: Date.now },
});

const SupportRequest = mongoose.model('SupportRequest', supportRequestSchema);

// API route to submit support request
app.post('/api/support', upload.array('attachments', 5), async (req, res) => {
  try {
    const { name, phone, email, queryCategory, description } = req.body; // ✅ added email
    const attachments = req.files ? req.files.map(file => file.path) : [];

    const newSupportRequest = new SupportRequest({
      name,
      phone,
      queryCategory,
      description,
      attachments,
    });

    const savedRequest = await newSupportRequest.save();

    // ✅ Prepare attachments for email
    const emailAttachments = attachments.map((filePath, index) => ({
      filename: `Attachment_${index + 1}${path.extname(filePath)}`,
      path: filePath
    }));

    // ✅ Send email to admin/support team
    const mailOptions = {
      from: 'vaishnavichandar2019@gmail.com',           // Authenticated Gmail
      to: 'vaishnavichandar2019@gmail.com',             // Admin gets the message
      replyTo: email || '',                             // User's email (if provided)
      subject: 'New Support Request Submitted',
      html: `
        <h2>Support Request Details</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || 'Not provided'}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Query Category:</strong> ${queryCategory}</p>
        <p><strong>Description:</strong><br/> ${description}</p>
        <p><strong>Attachments:</strong> ${attachments.length} file(s) attached</p>
      `,
      attachments: emailAttachments
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Support email send failed:', error);
      } else {
        console.log('Support request email sent:', info.response);
      }
    });

    res.json({ message: 'Support request submitted and email sent successfully.', request: savedRequest });
  } catch (err) {
    console.error('Error saving support request:', err);
    res.status(500).json({ error: 'Failed to submit support request.', details: err.message });
  }
});



const testimonialSchema = new mongoose.Schema({
  image: { type: String },
  name: { type: String, required: true },
  feedback: { type: String, required: true },
  role: { type: String, required: true },
  rating: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

app.post('/api/testimonials', upload.single('image'), async (req, res) => {
  try {
    const { name, feedback, role, rating } = req.body;
    const imagePath = req.file ? req.file.filename : ''; // ✅ save only filename

    if (!name || !feedback || !role || !rating) {
      return res.status(400).json({ error: 'All fields are required except image.' });
    }

    const newTestimonial = new Testimonial({
      image: imagePath, // ✅ store just the filename
      name,
      feedback,
      role,
      rating
    });

    const saved = await newTestimonial.save();
    res.json({ message: 'Testimonial submitted successfully', testimonial: saved });
  } catch (error) {
    console.error('Error saving testimonial:', error);
    res.status(500).json({ error: 'Failed to submit testimonial' });
  }
});


// GET all testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ submittedAt: -1 }); // latest first
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});



// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
