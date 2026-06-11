import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  companyName: { type: String, required: true, trim: true },
  companyWebsite: { type: String, trim: true },
  jobTitle: { type: String, required: true, trim: true },
  jobUrl: { type: String, trim: true },
  location: { type: String, trim: true },
  jobType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract'],
    default: 'Full-time'
  },
  jobSource: { type: String, trim: true, default: '' },
  salary: { type: String, trim: true },
  applicationDate: { type: Date, default: Date.now },
  dueDate: { type: Date },
  status: { 
    type: String, 
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied'
  },
  notes: { 
    type: String, 
    default: "" 
  }   // ← Changed to String for simplicity
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);