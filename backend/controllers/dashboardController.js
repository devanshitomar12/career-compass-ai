import Application from '../models/Application.js';
import User from '../models/User.js';

// Helper to get month name
const getMonthName = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months[new Date(date).getMonth()];
};

// @desc    Get dashboard metrics & analytics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Fetch User data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 2. Fetch all applications
    const applications = await Application.find({ user: userId });
    const totalApps = applications.length;

    // 3. Count stages
    const stagesCount = {
      Interested: 0,
      Applied: 0,
      'Online Assessment': 0,
      'Technical Interview': 0,
      'HR Interview': 0,
      'Offer Received': 0,
      Rejected: 0,
    };

    applications.forEach((app) => {
      if (stagesCount[app.currentStage] !== undefined) {
        stagesCount[app.currentStage]++;
      }
    });

    const interviewInvitations = 
      stagesCount['Online Assessment'] + 
      stagesCount['Technical Interview'] + 
      stagesCount['HR Interview'];

    const offersReceived = stagesCount['Offer Received'];
    const rejections = stagesCount['Rejected'];

    // 4. Success Rate
    const successRate = totalApps > 0 
      ? Math.round((offersReceived / totalApps) * 100) 
      : 0;

    // 5. Funnel Conversion Calculations
    // Funnel stages: Applied -> OA -> Technical -> HR -> Offer
    const funnel = {
      Applied: totalApps, // Everyone who applied or further
      OA: applications.filter(a => ['Online Assessment', 'Technical Interview', 'HR Interview', 'Offer Received'].includes(a.currentStage)).length,
      Technical: applications.filter(a => ['Technical Interview', 'HR Interview', 'Offer Received'].includes(a.currentStage)).length,
      HR: applications.filter(a => ['HR Interview', 'Offer Received'].includes(a.currentStage)).length,
      Offer: offersReceived,
    };

    // 6. Company Category by LPA Package (Tier 1 > 12, Tier 2: 6-12, Tier 3 < 6)
    const tiers = {
      'Tier 1 (Dream > 12 LPA)': 0,
      'Tier 2 (Elite 6-12 LPA)': 0,
      'Tier 3 (Mass < 6 LPA)': 0,
    };

    applications.forEach((app) => {
      if (app.packageOffered >= 12) {
        tiers['Tier 1 (Dream > 12 LPA)']++;
      } else if (app.packageOffered >= 6) {
        tiers['Tier 2 (Elite 6-12 LPA)']++;
      } else {
        tiers['Tier 3 (Mass < 6 LPA)']++;
      }
    });

    // 7. Applications by Month (Last 6 Months)
    const monthlyData = {};
    // Seed last 6 months with 0
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthName = getMonthName(d);
      monthlyData[monthName] = 0;
    }

    applications.forEach((app) => {
      const monthName = getMonthName(app.applicationDate);
      if (monthlyData[monthName] !== undefined) {
        monthlyData[monthName]++;
      }
    });

    const chartMonthly = Object.keys(monthlyData).map((key) => ({
      month: key,
      count: monthlyData[key],
    }));

    // 8. Placement Readiness Score Calculation (Out of 100)
    let readinessScore = 0;
    const strengths = [];
    const improvements = [];

    // Feature 1: Resume Uploaded (20%)
    if (user.resumePath) {
      readinessScore += 20;
      strengths.push('Resume is uploaded and verified.');
    } else {
      improvements.push('Upload a professional resume in your profile to boost score by 20%.');
    }

    // Feature 2: Projects completed (20%)
    if (user.projectsCount >= 2) {
      readinessScore += 20;
      strengths.push('Strong project portfolio (2+ projects).');
    } else if (user.projectsCount === 1) {
      readinessScore += 10;
      improvements.push('Add at least one more project to double your projects score.');
    } else {
      improvements.push('Add projects to demonstrate coding competency (+20%).');
    }

    // Feature 3: DSA Practice progress (20%)
    if (user.dsaProgress >= 100) {
      readinessScore += 20;
      strengths.push('Excellent DSA practice (100+ problems solved).');
    } else if (user.dsaProgress >= 50) {
      readinessScore += 15;
      strengths.push('Moderate DSA practice (50+ problems solved).');
      improvements.push('Solve 100+ DSA questions to maximize technical interview readiness.');
    } else if (user.dsaProgress > 0) {
      readinessScore += 10;
      improvements.push('Practice more DSA questions on LeetCode/GeeksforGeeks to improve technical rounds.');
    } else {
      improvements.push('Begin solving DSA questions to clear the Online Assessments (+20%).');
    }

    // Feature 4: Applications Tracked (20%)
    if (totalApps >= 10) {
      readinessScore += 20;
      strengths.push('High application volume (10+ applied).');
    } else if (totalApps >= 3) {
      readinessScore += 15;
      strengths.push('Active applicant with multiple listings tracked.');
      improvements.push('Apply to more companies to improve chances of offer (+5%).');
    } else if (totalApps >= 1) {
      readinessScore += 10;
      improvements.push('Increase your application pipeline by targeting more roles.');
    } else {
      improvements.push('Apply to your first placement listing to start your journey (+20%).');
    }

    // Feature 5: Skills vs Target Role Alignment (20%)
    if (user.targetRole) {
      strengths.push(`Target role defined: ${user.targetRole}`);
      if (user.knownSkills && user.knownSkills.length >= 4) {
        readinessScore += 20;
        strengths.push('Broad base of key skills declared.');
      } else if (user.knownSkills && user.knownSkills.length >= 2) {
        readinessScore += 10;
        improvements.push('Add more primary technical skills in your profile to improve target alignment.');
      } else {
        improvements.push('Enter skills to align yourself with your target role.');
      }
    } else {
      improvements.push('Select a target placement role in your profile settings (+20%).');
    }

    res.json({
      metrics: {
        totalApplications: totalApps,
        interviewInvitations,
        offersReceived,
        rejections,
        successRate,
      },
      readiness: {
        score: readinessScore,
        strengths,
        improvements,
      },
      analytics: {
        monthlyApplications: chartMonthly,
        stagesDistribution: stagesCount,
        funnel,
        tiersDistribution: tiers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
