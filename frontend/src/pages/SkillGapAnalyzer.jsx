import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Target, CheckCircle2, AlertTriangle, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';

const SkillGapAnalyzer = () => {
  const { user } = useAuth();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rolesList, setRolesList] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [error, setError] = useState('');

  const fetchRoles = async () => {
    try {
      const res = await api.get('/skills/roles');
      setRolesList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalysis = async (roleName) => {
    setLoading(true);
    setError('');
    try {
      const url = roleName ? `/skills/analyze?role=${encodeURIComponent(roleName)}` : '/skills/analyze';
      const res = await api.get(url);
      setAnalysis(res.data);
      setSelectedRole(res.data.targetRole);
    } catch (err) {
      setError(err.response?.data?.message || 'Please specify a target role in your profile or select one below.');
      setAnalysis(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchAnalysis();
  }, [user]);

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    fetchAnalysis(role);
  };

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Skill Gap Analyzer</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Identify missing skills for your target role and explore curated learning resources.
        </p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Target size={20} style={{ color: 'var(--color-primary)' }} />
          <strong style={{ fontSize: '15px' }}>Analyze Target Role:</strong>
        </div>
        
        <select
          className="form-input"
          style={{ width: '280px', margin: 0, height: '42px' }}
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option value="">-- Choose Placement Role --</option>
          {rolesList.map((r) => (
            <option key={r._id} value={r.roleName}>
              {r.roleName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Analyzing skill matrices...</h3>
        </div>
      ) : error ? (
        <div className="glass-panel text-center" style={{ padding: '40px' }}>
          <HelpCircle size={40} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
          <p style={{ color: 'var(--color-danger)', fontWeight: '500', marginBottom: '16px' }}>{error}</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '500px', margin: '0 auto' }}>
            To begin, select one of the pre-configured roles above or update your target placement role in the profile panel on your dashboard.
          </p>
        </div>
      ) : analysis ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Progress Match & Lists */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Match Circle & Progress */}
            <div className="glass-panel text-center">
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Skill Compatibility: <span style={{ color: 'var(--color-primary)' }}>{analysis.targetRole}</span>
              </h3>
              
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: '800',
                  color: 'var(--color-primary)',
                  fontFamily: 'Outfit',
                  marginBottom: '10px',
                }}
              >
                {analysis.matchPercentage}%
              </div>

              {/* Progress bar container */}
              <div style={{ width: '100%', height: '10px', background: 'var(--bg-secondary)', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${analysis.matchPercentage}%`,
                    background: 'var(--grad-primary)',
                    borderRadius: '5px',
                    transition: 'width 0.5s ease',
                  }}
                ></div>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                You possess {analysis.matchingSkills.length} out of the {analysis.requiredSkills.length} core skills recommended by recruiters.
              </p>
            </div>

            {/* Matching and Missing Skills lists */}
            <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--color-success)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} /> Matching ({analysis.matchingSkills.length})
                </h4>
                {analysis.matchingSkills.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.matchingSkills.map((skill) => (
                      <div
                        key={skill}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: 'rgba(16, 185, 129, 0.08)',
                          border: '1px solid rgba(16, 185, 129, 0.15)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No matching skills yet.</p>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: 'var(--color-warning)', textTransform: 'uppercase', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> Missing ({analysis.missingSkills.length})
                </h4>
                {analysis.missingSkills.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {analysis.missingSkills.map((skill) => (
                      <div
                        key={skill}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          background: 'rgba(245, 158, 11, 0.08)',
                          border: '1px solid rgba(245, 158, 11, 0.15)',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--color-success)', fontWeight: '600' }}>Great! You possess all required skills.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Recommendations */}
          <div className="glass-panel">
            <h3 style={{ fontSize: '18px', marginBottom: '20px' }}>Personalized Roadmap</h3>

            {analysis.recommendations.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {analysis.recommendations.map((rec, index) => (
                  <div
                    key={rec.skill}
                    className="glass-card"
                    style={{ background: 'var(--bg-secondary)', borderLeft: '4px solid var(--color-primary)', padding: '16px' }}
                  >
                    <div className="flex-align-center" style={{ gap: '8px', marginBottom: '8px' }}>
                      <span
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'var(--grad-primary)',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                        }}
                      >
                        {index + 1}
                      </span>
                      <h4 style={{ fontSize: '15px' }}>Learn {rec.skill}</h4>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: '1.4' }}>
                      {rec.suggestion}
                    </p>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {rec.resources.map((res) => (
                        <a
                          key={res.name}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          {res.name} <ExternalLink size={12} />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--color-success)', marginBottom: '8px' }} />
                <h4 style={{ color: 'var(--color-success)' }}>Outstanding!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
                  You meet all pre-configured skill requirements for this role. Consider looking at wishlist company interview notes!
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SkillGapAnalyzer;
