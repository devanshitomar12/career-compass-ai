import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SkillRequirement from './models/SkillRequirement.js';

dotenv.config();

const rolesData = [
  {
    roleName: 'Software Engineer',
    skills: [
      'Data Structures',
      'Algorithms',
      'System Design',
      'Object Oriented Programming',
      'DBMS',
      'Operating Systems',
      'Computer Networks',
      'Java or C++',
      'Git',
    ],
  },
  {
    roleName: 'Frontend Developer',
    skills: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Responsive Design',
      'Git',
      'REST APIs',
      'Tailwind CSS',
      'Web Performance',
    ],
  },
  {
    roleName: 'Backend Developer',
    skills: [
      'Node.js',
      'Express.js',
      'MongoDB',
      'SQL Databases',
      'REST APIs',
      'System Design',
      'Git',
      'JWT Authentication',
      'Docker',
    ],
  },
  {
    roleName: 'Data Analyst',
    skills: [
      'Python',
      'SQL',
      'Statistics',
      'Excel',
      'Tableau or PowerBI',
      'Data Wrangling',
      'Pandas',
      'Data Visualization',
    ],
  },
  {
    roleName: 'Product Manager',
    skills: [
      'Product Strategy',
      'Agile / Scrum',
      'User Research',
      'Wireframing',
      'Data Analytics',
      'Roadmap Design',
      'A/B Testing',
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Delete existing requirements
    await SkillRequirement.deleteMany({});
    console.log('Cleared existing skill requirements.');

    // Insert seeded requirements
    await SkillRequirement.insertMany(rolesData);
    console.log('Successfully seeded skill requirements data.');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
