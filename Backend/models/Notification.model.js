import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['achievement', 'streak', 'level_up', 'resource', 'badge', 'subscription', 'interview'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🔔'
  },
  link: {
    type: String, // URL to navigate when clicked
    default: null
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Additional data (badge info, achievement details, etc.)
    default: {}
  }
}, {
  timestamps: true
});

// Index for efficient queries
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

// Methods
notificationSchema.methods.markAsRead = async function() {
  this.isRead = true;
  return await this.save();
};

// Static methods
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({ userId, isRead: false });
};

notificationSchema.statics.markAllAsRead = async function(userId) {
  return await this.updateMany(
    { userId, isRead: false },
    { isRead: true }
  );
};

notificationSchema.statics.createNotification = async function(data) {
  const notification = new this(data);
  return await notification.save();
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;