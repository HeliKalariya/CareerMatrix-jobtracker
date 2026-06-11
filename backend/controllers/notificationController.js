import Notification from '../models/Notification.js';
import Application from '../models/Application.js';

export const createNotification = async ({ user, title, message, type = 'info', application }) => {
  return Notification.create({ user, title, message, type, application });
};

export const checkDueDateReminders = async (userId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dueApps = await Application.find({
    user: userId,
    dueDate: { $gte: today, $lt: tomorrow }
  });

  for (const app of dueApps) {
    const exists = await Notification.findOne({
      user: userId,
      application: app._id,
      type: 'reminder',
      createdAt: { $gte: today }
    });
    if (!exists) {
      await createNotification({
        user: userId,
        title: 'Due Date Reminder',
        message: `Follow up on "${app.jobTitle}" at ${app.companyName} — due today.`,
        type: 'reminder',
        application: app._id
      });
    }
  }
};

export const getNotifications = async (req, res) => {
  await checkDueDateReminders(req.user._id);
  const notifications = await Notification.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .populate('application', 'jobTitle companyName status');
  res.json(notifications);
};

export const getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({ user: req.user._id, read: false });
  res.json({ count });
};

export const markAsRead = async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { read: true },
    { new: true }
  );
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json(notification);
};

export const markAllAsRead = async (req, res) => {
  await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
};

export const deleteNotification = async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id
  });
  if (!notification) return res.status(404).json({ message: 'Notification not found' });
  res.json({ message: 'Notification deleted' });
};
