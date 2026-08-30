import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  website: { type: String, trim: true, default: '' },
  industry: { type: String, trim: true, default: '' },
  location: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '' }
}, { timestamps: true });

companySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Company', companySchema);
