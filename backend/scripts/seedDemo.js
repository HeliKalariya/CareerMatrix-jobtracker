import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Application from '../models/Application.js';

dotenv.config();
await connectDB();

const email = 'dashboard.demo@careermatrix.local';
let user = await User.findOne({ email });
if (!user) user = await User.create({ name: 'Alex Morgan', email, password: 'CareerDemo2026' });

const items = [
  ['Figma', 'Design software', 'Remote', 'Senior Product Designer', 'Interview', 2],
  ['Stripe', 'Financial technology', 'Bengaluru / Remote', 'Product Designer', 'Applied', 5],
  ['Notion', 'Productivity software', 'Remote', 'Product Design Lead', 'Offer', 8],
  ['Vercel', 'Developer tools', 'Remote', 'Product Designer', 'Applied', 11],
  ['Canva', 'Design platform', 'Bengaluru', 'UX Designer', 'Interview', 14],
  ['Linear', 'Product management', 'Remote', 'Product Designer', 'Applied', 17],
  ['Razorpay', 'Financial technology', 'Bengaluru', 'Senior UX Designer', 'Rejected', 20],
  ['Postman', 'Developer tools', 'Bengaluru', 'Product Designer', 'Interview', 23],
  ['Atlassian', 'Collaboration software', 'Bengaluru / Remote', 'Experience Designer', 'Applied', 26],
  ['Airbnb', 'Travel technology', 'Remote', 'Product Designer', 'Applied', 29]
];

for (const [name, industry, location, jobTitle, status, daysAgo] of items) {
  await Company.findOneAndUpdate({ user: user._id, name }, { industry, location, website: `https://${name.toLowerCase()}.com`, notes: 'Demo dashboard company' }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const applicationDate = new Date();
  applicationDate.setDate(applicationDate.getDate() - daysAgo);
  await Application.findOneAndUpdate(
    { user: user._id, companyName: name, jobTitle },
    { companyName: name, jobTitle, location, jobType: 'Full-time', jobSource: 'Company Website', status, applicationDate, notes: 'Demo dashboard data' },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

console.log(`Demo dashboard ready for ${email} (password: CareerDemo2026)`);
await (await import('mongoose')).default.disconnect();
