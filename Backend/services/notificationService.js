import Notification from '../models/Notification.model.js';

class NotificationService {
  // Create notification helper
  async createNotification({ userId, type, title, message, icon, link, metadata = {} }) {
    try {
      return await Notification.createNotification({
        userId,
        type,
        title,
        message,
        icon,
        link,
        metadata
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Streak notifications
  async notifyStreakBroken(userId, previousStreak) {
    return await this.createNotification({
      userId,
      type: 'streak',
      title: 'Streak Broken',
      message: `Your ${previousStreak} day streak has ended. Start a new one today!`,
      icon: '💔',
      link: '/interview-setup',
      metadata: { previousStreak }
    });
  }

  async notifyStreakMilestone(userId, streak) {
    const milestones = {
      7: { title: 'Week Warrior!', icon: '⚔️' },
      30: { title: 'Monthly Master!', icon: '🏆' },
      100: { title: 'Century Champion!', icon: '💯' }
    };

    const milestone = milestones[streak];
    if (milestone) {
      return await this.createNotification({
        userId,
        type: 'streak',
        title: milestone.title,
        message: `Congratulations! You've maintained a ${streak} day streak!`,
        icon: milestone.icon,
        link: '/achievements',
        metadata: { streak }
      });
    }
  }

  // Badge notifications
  async notifyBadgeEarned(userId, badgeName, badgeIcon) {
    return await this.createNotification({
      userId,
      type: 'badge',
      title: 'New Badge Earned!',
      message: `You've unlocked the "${badgeName}" badge!`,
      icon: badgeIcon,
      link: '/achievements',
      metadata: { badgeName, badgeIcon }
    });
  }

  // Level up notifications
  async notifyLevelUp(userId, newLevel) {
    return await this.createNotification({
      userId,
      type: 'level_up',
      title: 'Level Up!',
      message: `Congratulations! You've reached Level ${newLevel}!`,
      icon: '🎖️',
      link: '/dashboard',
      metadata: { newLevel }
    });
  }

  // Achievement notifications
  async notifyAchievement(userId, achievement) {
    return await this.createNotification({
      userId,
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: achievement.description || `You've unlocked ${achievement.name}!`,
      icon: achievement.icon || '🏅',
      link: '/achievements',
      metadata: { achievement }
    });
  }

  // Interview completion
  async notifyInterviewComplete(userId, interviewId, score) {
    return await this.createNotification({
      userId,
      type: 'interview',
      title: 'Interview Completed!',
      message: `You scored ${score}% on your recent interview. Check out the detailed results!`,
      icon: score >= 80 ? '🌟' : score >= 60 ? '👍' : '💪',
      link: `/results/${interviewId}`,
      metadata: { interviewId, score }
    });
  }

  // Resource notifications
  async notifyNewResources(userId, count) {
    return await this.createNotification({
      userId,
      type: 'resource',
      title: 'New Learning Resources',
      message: `${count} new learning resources have been added!`,
      icon: '📚',
      link: '/resources',
      metadata: { count }
    });
  }

  // Subscription notifications
  async notifySubscriptionExpiring(userId, daysLeft) {
    return await this.createNotification({
      userId,
      type: 'subscription',
      title: 'Subscription Expiring Soon',
      message: `Your subscription will expire in ${daysLeft} days. Renew to keep your benefits!`,
      icon: '⚠️',
      link: '/subscription',
      metadata: { daysLeft }
    });
  }

  async notifyInterviewsRunningLow(userId, remaining) {
    return await this.createNotification({
      userId,
      type: 'subscription',
      title: 'Interviews Running Low',
      message: `You have ${remaining} interviews remaining this month. Consider upgrading!`,
      icon: '📊',
      link: '/subscription',
      metadata: { remaining }
    });
  }
}

export default new NotificationService();