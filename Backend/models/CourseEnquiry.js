const mongoose = require('mongoose');

const CourseEnquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  course: { type: String, required: true },
  termsAccepted: { type: Boolean, required: true },
  submittedAt: { type: Date, default: Date.now },
});

const CourseEnquiry = mongoose.model('CourseEnquiry', CourseEnquirySchema);

module.exports = CourseEnquiry;
