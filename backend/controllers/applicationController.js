import Application from '../models/Application.js';

export const getApplications = async (req, res) => {
  const { search, status } = req.query;
  let query = { user: req.user._id };

  if (search) {
    query.$or = [
      { companyName: { $regex: search, $options: 'i' } },
      { jobTitle: { $regex: search, $options: 'i' } }
    ];
  }
  if (status) query.status = status;

  const applications = await Application.find(query).sort({ createdAt: -1 });
  res.json(applications);
};

export const getApplicationById = async (req, res) => {
  const app = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: 'Application not found' });
  res.json(app);
};

export const createApplication = async (req, res) => {
  try {
    const application = await Application.create({
      ...req.body,
      user: req.user._id,
      notes: req.body.notes || ""
    });

    res.status(201).json(application);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  const existing = await Application.findOne({ _id: req.params.id, user: req.user._id });
  if (!existing) return res.status(404).json({ message: 'Application not found' });

  const app = await Application.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );

  res.json(app);
};

export const deleteApplication = async (req, res) => {
  const app = await Application.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!app) return res.status(404).json({ message: 'Application not found' });
  res.json({ message: 'Application deleted' });
};

export const getStats = async (req, res) => {
  const stats = await Application.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const total = await Application.countDocuments({ user: req.user._id });

  res.json({
    total,
    applied: stats.find(s => s._id === 'Applied')?.count || 0,
    interview: stats.find(s => s._id === 'Interview')?.count || 0,
    offer: stats.find(s => s._id === 'Offer')?.count || 0,
    rejected: stats.find(s => s._id === 'Rejected')?.count || 0,
  });
};
