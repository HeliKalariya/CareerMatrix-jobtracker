import Company from '../models/Company.js';
import Application from '../models/Application.js';

export const getCompanies = async (req, res) => {
  const companies = await Company.find({ user: req.user._id }).sort({ name: 1 });
  const applicationCounts = await Application.aggregate([
    { $match: { user: req.user._id } },
    { $group: { _id: { $toLower: '$companyName' }, count: { $sum: 1 } } }
  ]);
  const counts = Object.fromEntries(applicationCounts.map(({ _id, count }) => [_id, count]));
  res.json(companies.map((company) => ({ ...company.toObject(), applicationCount: counts[company.name.toLowerCase()] || 0 })));
};

export const createCompany = async (req, res) => {
  try {
    const company = await Company.create({ ...req.body, user: req.user._id });
    res.status(201).json({ ...company.toObject(), applicationCount: 0 });
  } catch (error) {
    const message = error.code === 11000 ? 'That company is already in your list' : error.message;
    res.status(400).json({ message });
  }
};

export const updateCompany = async (req, res) => {
  const company = await Company.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id }, req.body, { new: true, runValidators: true }
  );
  if (!company) return res.status(404).json({ message: 'Company not found' });
  res.json(company);
};

export const deleteCompany = async (req, res) => {
  const company = await Company.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!company) return res.status(404).json({ message: 'Company not found' });
  res.json({ message: 'Company deleted' });
};
