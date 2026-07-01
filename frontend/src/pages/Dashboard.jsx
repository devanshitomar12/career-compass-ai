import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  Plus,
  Briefcase,
  Target,
  Upload,
  Clock,
  Sparkles,
} from 'lucide-react';

const Dashboard = () => {
  const { user, updateProfile, uploadResume } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Profile settings local state
  const [targetRole, setTargetRole] = useState('');
  const [knownSkills, setKnownSkills] = useState('');
  const [projectsCount, setProjectsCount] = useState(0);
  const [dsaProgress, setDsaProgress] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [profileMessage, setProfileMessage] = useState('');

  // Countdown target date (stored in localStorage)
  const [countdownDate, setCountdownDate] = useState(() => {
    return localStorage.getItem('countdownDate') || '2026-09-01';
  });
  const [daysLeft, setDaysLeft] = useState(0);

  // Available roles dropdown list
  const [rolesList, setRolesList] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/dashboard');
      setDashboardData(res.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await api.get('/skills/roles');
      setRolesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRoles();
  }, [user]);

  // Sync profile fields from user context
  useEffect(() => {
    if (user) {
      setTargetRole(user.targetRole || '');
      setKnownSkills(user.knownSkills ? user.knownSkills.join(', ') : '');
      setProjectsCount(user.projectsCount || 0);
      setDsaProgress(user.dsaProgress || 0);
    }
  }, [user]);

  // Calculate Countdown
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(countdownDate) - +new Date();
      let days = 0;
      if (difference > 0) {
        days = Math.ceil(difference / (1000 * 60 * 60 * 24));
      }
      setDaysLeft(days);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [countdownDate]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    
    const skillsArray = knownSkills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill !== '');

    const result = await updateProfile({
      targetRole,
      knownSkills: skillsArray,
      projectsCount,
      dsaProgress,
    });

    if (result.success) {
      setProfileMessage('Profile updated successfully!');
      fetchDashboardData();
    } else {
      setProfileMessage(result.message);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    setUploadStatus('Uploading...');
    const result = await uploadResume(resumeFile);
    if (result.success) {
      setUploadStatus('Resume uploaded successfully!');
      setResumeFile(null);
      fetchDashboardData();
    } else {
      setUploadStatus(result.message);
    }
  };

  const handleCountdownChange = (e) => {
    const val = e.target.value;
    setCountdownDate(val);
    localStorage.setItem('countdownDate', val);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Loading Dashboard Analytics...</h2>
      </div>
    );
  }

  const metrics = dashboardData?.metrics || {
    totalApplications: 0,
    interviewInvitations: 0,
    offersReceived: 0,
    rejections: 0,
    successRate: 0,
  };

  const readiness = dashboardData?.readiness || {
    score: 0,
    strengths: [],
    improvements: [],
  };

  const badges = user?.badges || [];

  // Circle calculations for progress ring
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (readiness.score / 100) * circumference;

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>
          Welcome back, {user?.name}! <Sparkles size={24} style={{ color: 'var(--color-primary)', display: 'inline' }} />
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Here is your placement readiness roadmap and tracked job applications.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="glass-panel metric-card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Total Applications</p>
            <p className="metric-val">{metrics.totalApplications}</p>
          </div>
          <FileText size={36} style={{ color: 'var(--color-primary)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel metric-card" style={{ borderLeft: '4px solid var(--color-warning)' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Interview Calls</p>
            <p className="metric-val">{metrics.interviewInvitations}</p>
          </div>
          <Calendar size={36} style={{ color: 'var(--color-warning)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel metric-card" style={{ borderLeft: '4px solid var(--color-success)' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Offers Received</p>
            <p className="metric-val">{metrics.offersReceived}</p>
          </div>
          <CheckCircle size={36} style={{ color: 'var(--color-success)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel metric-card" style={{ borderLeft: '4px solid var(--color-danger)' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Rejections</p>
            <p className="metric-val">{metrics.rejections}</p>
          </div>
          <XCircle size={36} style={{ color: 'var(--color-danger)', opacity: 0.8 }} />
        </div>

        <div className="glass-panel metric-card" style={{ borderLeft: '4px solid var(--color-info)' }}>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>Success Rate</p>
            <p className="metric-val">{metrics.successRate}%</p>
          </div>
          <TrendingUp size={36} style={{ color: 'var(--color-info)', opacity: 0.8 }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Readiness Score & Countdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Readiness Meter */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Placement Readiness Score</h2>
            
            <div className="readiness-container">
              <div className="circular-progress">
                <svg>
                  <circle className="bg-circle" cx="75" cy="75" r={radius} />
                  <circle
                    className="val-circle"
                    cx="75"
                    cy="75"
                    r={radius}
                    style={{
                      strokeDasharray: circumference,
                      strokeDashoffset: strokeDashoffset,
                    }}
                  />
                </svg>
                <div className="progress-text-center">{readiness.score}%</div>
              </div>

              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                  {readiness.score >= 80
                    ? 'Excellent Preparation!'
                    : readiness.score >= 50
                    ? 'On the Right Track'
                    : 'Action Required'}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.4' }}>
                  Your score is calculated based on resume completion, projects count, DSA practice, application volume, and target role skill alignment.
                </p>
              </div>
            </div>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '24px 0' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: '12px' }}>Strengths</h4>
                {readiness.strengths.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {readiness.strengths.map((str, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{str}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Complete profile settings to build strengths.</p>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--color-warning)', textTransform: 'uppercase', marginBottom: '12px' }}>Improvements</h4>
                {readiness.improvements.length > 0 ? (
                  <ul style={{ paddingLeft: '20px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    {readiness.improvements.map((imp, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{imp}</li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: '600' }}>All setup items complete! You are fully prepared.</p>
                )}
              </div>
            </div>
          </div>

          {/* Placement Countdown */}
          <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '10px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-warning)',
                }}
              >
                <Clock size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px' }}>Placement Season Countdown</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Configure your placement drive date below</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--color-warning)' }}>{daysLeft}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px', fontWeight: '700', textTransform: 'uppercase' }}>Days Left</span>
              </div>
              <input
                type="date"
                className="form-input"
                style={{ width: '150px', padding: '6px 12px', fontSize: '13px' }}
                value={countdownDate}
                onChange={handleCountdownChange}
              />
            </div>
          </div>

        </div>

        {/* Right Column: Achievements & Profile Config */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Achievements Badges */}
          <div className="glass-panel">
            <div className="flex-align-center" style={{ marginBottom: '16px' }}>
              <Award size={22} style={{ color: 'var(--color-primary)' }} />
              <h2 style={{ fontSize: '20px' }}>Unlocked Achievements</h2>
            </div>
            
            <div className="badge-grid">
              {[
                { name: 'First Application', desc: 'Applied to first job listing', icon: '🚀' },
                { name: '10 Applications', desc: 'Tracked 10 distinct job listings', icon: '🔥' },
                { name: 'Interview Ready', desc: 'Completed basic profile prep items', icon: '🎯' },
                { name: 'Offer Received', desc: 'Succeeded in getting a job offer', icon: '🎉' },
              ].map((badge) => {
                const isUnlocked = badges.some((b) => b.name === badge.name);
                return (
                  <div key={badge.name} className={`badge-item ${isUnlocked ? 'unlocked' : ''}`}>
                    <div className="badge-icon-wrap" style={{ background: isUnlocked ? 'var(--grad-primary)' : 'var(--bg-secondary)', color: isUnlocked ? 'white' : 'var(--text-muted)' }}>
                      <span style={{ fontSize: '24px' }}>{badge.icon}</span>
                    </div>
                    <span className="badge-title">{badge.name}</span>
                    <span className="badge-desc">{badge.desc}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Profile Quick Setup & Resume Upload */}
          <div className="glass-panel">
            <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Profile Parameters</h2>
            
            {profileMessage && (
              <div
                style={{
                  padding: '8px 12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: 'var(--color-success)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}
              >
                {profileMessage}
              </div>
            )}

            <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Target Role</label>
                <select
                  className="form-input"
                  style={{ height: '44px' }}
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="">-- Select Target Placement Role --</option>
                  {rolesList.map((role) => (
                    <option key={role._id} value={role.roleName}>
                      {role.roleName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Known Skills (comma separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. React, Node, SQL, Python"
                  value={knownSkills}
                  onChange={(e) => setKnownSkills(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Projects Completed</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={projectsCount}
                    onChange={(e) => setProjectsCount(e.target.value)}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">DSA Solved Problems</label>
                  <input
                    type="number"
                    min="0"
                    className="form-input"
                    value={dsaProgress}
                    onChange={(e) => setDsaProgress(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ padding: '10px' }}>
                Save Profile Parameters
              </button>
            </form>

            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '20px 0' }} />

            {/* Resume Upload Box */}
            <h3 style={{ fontSize: '15px', marginBottom: '12px' }}>Resume Portal</h3>
            
            {user?.resumePath ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--bg-secondary)', borderRadius: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                  📄 {user.resumePath.split('/').pop()}
                </span>
                <a
                  href={`http://localhost:5000${user.resumePath}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '12px', color: 'var(--color-primary)', textDecoration: 'none', fontWeight: '600' }}
                >
                  Download
                </a>
              </div>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>No resume uploaded yet.</p>
            )}

            <form onSubmit={handleResumeUpload} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-file-input"
                onChange={(e) => setResumeFile(e.target.files[0])}
              />
              <label
                htmlFor="resume-file-input"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px', cursor: 'pointer', fontSize: '13px' }}
              >
                {resumeFile ? resumeFile.name : 'Select File'}
              </label>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 12px' }}
                disabled={!resumeFile}
              >
                <Upload size={16} />
              </button>
            </form>
            {uploadStatus && (
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', textAlign: 'center' }}>
                {uploadStatus}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
