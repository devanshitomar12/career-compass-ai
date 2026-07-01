import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
  BookOpen,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  CheckCircle,
  HelpCircle,
  Briefcase,
  AlertCircle,
} from 'lucide-react';

const InterviewPrep = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');
  const [questions, setQuestions] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [preparationStatus, setPreparationStatus] = useState('Not Started');

  const fetchExperiences = async () => {
    try {
      const res = await api.get('/interviews');
      setExperiences(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setCompanyName('');
    setRole('');
    setExperience('');
    setQuestions('');
    setPersonalNotes('');
    setPreparationStatus('Not Started');
    setIsModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setCompanyName(exp.companyName);
    setRole(exp.role);
    setExperience(exp.experience || '');
    setQuestions(exp.questions ? exp.questions.join('\n') : '');
    setPersonalNotes(exp.personalNotes || '');
    setPreparationStatus(exp.preparationStatus || 'Not Started');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const questionsArray = questions
      .split('\n')
      .map((q) => q.trim())
      .filter((q) => q !== '');

    const payload = {
      companyName,
      role,
      experience,
      questions: questionsArray,
      personalNotes,
      preparationStatus,
    };

    try {
      if (editingExp) {
        await api.put(`/interviews/${editingExp._id}`, payload);
      } else {
        await api.post('/interviews', payload);
      }
      setIsModalOpen(false);
      fetchExperiences();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this experience log?')) {
      try {
        await api.delete(`/interviews/${id}`);
        fetchExperiences();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Ready') return 'var(--color-success)';
    if (status === 'In Progress') return 'var(--color-warning)';
    return 'var(--text-muted)';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Interview Prep Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Record past interview experiences, study frequently asked questions, and log preparation status.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Log
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading interview logs...</h3>
        </div>
      ) : experiences.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px' }}>
          <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h3>No Preparation Logs</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            Add a company prep folder to track custom questions and personal preparation checklist status.
          </p>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add Log
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
          {experiences.map((exp) => (
            <div key={exp._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'space-between' }}>
              <div>
                {/* Title Card Header */}
                <div className="flex-between" style={{ marginBottom: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '19px' }}>{exp.companyName}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <Briefcase size={13} /> {exp.role}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: `1px solid ${getStatusColor(exp.preparationStatus)}`,
                      color: getStatusColor(exp.preparationStatus),
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    {exp.preparationStatus}
                  </span>
                </div>

                <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '12px 0' }} />

                {/* Experience Details */}
                {exp.experience && (
                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Process Details</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      {exp.experience}
                    </p>
                  </div>
                )}

                {/* Common Questions */}
                {exp.questions && exp.questions.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>Interview Questions</h4>
                    <ul style={{ paddingLeft: '16px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                      {exp.questions.map((q, idx) => (
                        <li key={idx} style={{ marginBottom: '4px' }}>"{q}"</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Personal Notes */}
                {exp.personalNotes && (
                  <div>
                    <h4 style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Study Notes</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4', whiteSpace: 'pre-wrap' }}>
                      {exp.personalNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions Footer */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                <button
                  onClick={() => openEditModal(exp)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(exp._id)}
                  className="btn btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '12px', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Popup */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)',
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: '550px', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>
              {editingExp ? 'Edit Preparation Log' : 'Add Preparation Log'}
            </h2>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Amazon"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. SDE-1"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Preparation Status</label>
                <select
                  className="form-input"
                  value={preparationStatus}
                  onChange={(e) => setPreparationStatus(e.target.value)}
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Interview Rounds & Process Details</label>
                <textarea
                  className="form-input"
                  style={{ height: '80px', resize: 'vertical' }}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Round 1: OA (DSA questions on Arrays)&#10;Round 2: Technical (System design & JS concepts)"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Interview Questions (one question per line)</label>
                <textarea
                  className="form-input"
                  style={{ height: '80px', resize: 'vertical' }}
                  value={questions}
                  onChange={(e) => setQuestions(e.target.value)}
                  placeholder="How does virtual DOM work?&#10;Explain closures in Javascript.&#10;Solve Longest Common Subsequence."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Personal Preparation Study Notes</label>
                <textarea
                  className="form-input"
                  style={{ height: '80px', resize: 'vertical' }}
                  value={personalNotes}
                  onChange={(e) => setPersonalNotes(e.target.value)}
                  placeholder="Revise dynamic programming patterns. Review time complexity of heap operations."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPrep;
