import Badge from '../models/Badge.js';
import Application from '../models/Application.js';
import User from '../models/User.js';

export const checkAndUnlockBadges = async (userId) => {
  const unlockedBadges = [];
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const apps = await Application.find({ user: userId });
    const appCount = apps.length;
    const hasOffer = apps.some((app) => app.currentStage === 'Offer Received');

    // Badge 1: First Application
    if (appCount >= 1) {
      const exists = await Badge.findOne({ user: userId, name: 'First Application' });
      if (!exists) {
        const newBadge = await Badge.create({
          user: userId,
          name: 'First Application',
          description: 'Submitted your very first job application!',
        });
        unlockedBadges.push(newBadge);
      }
    }

    // Badge 2: 10 Applications
    if (appCount >= 10) {
      const exists = await Badge.findOne({ user: userId, name: '10 Applications' });
      if (!exists) {
        const newBadge = await Badge.create({
          user: userId,
          name: '10 Applications',
          description: 'Successfully tracked 10 job applications!',
        });
        unlockedBadges.push(newBadge);
      }
    }

    // Badge 3: Offer Received
    if (hasOffer) {
      const exists = await Badge.findOne({ user: userId, name: 'Offer Received' });
      if (!exists) {
        const newBadge = await Badge.create({
          user: userId,
          name: 'Offer Received',
          description: 'Hooray! Received a placement job offer!',
        });
        unlockedBadges.push(newBadge);
      }
    }

    // Badge 4: Interview Ready
    // Criteria: Has resume uploaded, has >= 1 project, has >= 30 DSA problems solved, and targetRole is set
    const isProfileComplete = 
      user.resumePath && 
      user.projectsCount >= 1 && 
      user.dsaProgress >= 20 && 
      user.targetRole;

    if (isProfileComplete) {
      const exists = await Badge.findOne({ user: userId, name: 'Interview Ready' });
      if (!exists) {
        const newBadge = await Badge.create({
          user: userId,
          name: 'Interview Ready',
          description: 'Profile complete: Resume uploaded, project built, and DSA practice started!',
        });
        unlockedBadges.push(newBadge);
      }
    }

  } catch (error) {
    console.error('Error unlocking badges:', error);
  }

  return unlockedBadges;
};
