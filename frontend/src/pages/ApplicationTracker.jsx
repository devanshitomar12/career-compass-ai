import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { exportApplicationsToPdf } from '../utils/exportPdf';
import {
  Search,
  SlidersHorizontal,
  Plus,
  Table as TableIcon,
  KanbanSquare,
  GitFork,
  FileDown,
  Trash2,
  Edit2,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('table'); // table, kanban, timeline
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('');
  const [packageOffered, setPackageOffered] = useState('');
  const [location, setLocation] = useState('');
  const [applicationDate, setApplicationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [currentStage, setCurrentStage] = useState('Applied');

  const stages = [
    'Interested',
    'Applied',
    'Online Assessment',
    'Technical Interview',
    'HR Interview',
    'Offer Received',
    'Rejected',
  ];

  const fetchApplications = async () => {
    try {
      const res = await api.get('/applications');
      setApplications(res.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const openAddModal = () => {
    setEditingApp(null);
    setCompanyName('');
    setRole('');
    setPackageOffered('');
    setLocation('');
    setApplicationDate(new Date().toISOString().split('T')[0]);
    setCurrentStage('Applied');
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setCompanyName(app.companyName);
    setRole(app.role);
    setPackageOffered(app.packageOffered || '');
    setLocation(app.location || '');
    setApplicationDate(new Date(app.applicationDate).toISOString().split('T')[0]);
    setCurrentStage(app.currentStage);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      companyName,
      role,
      packageOffered: packageOffered ? Number(packageOffered) : 0,
      location,
      applicationDate,
      currentStage,
    };

    try {
      if (editingApp) {
        await api.put(`/applications/${editingApp._id}`, payload);
      } else {
        await api.post('/applications', payload);
      }
      setIsModalOpen(false);
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await api.delete(`/applications/${id}`);
        fetchApplications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Kanban HTML5 Drag & Drop handlers
  const handleDragStart = (e, id) => {
    e.dataTransfer.setData('applicationId', id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('applicationId');
    if (!id) return;
    try {
      await api.put(`/applications/${id}`, { currentStage: targetStage });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStageChange = async (id, stage) => {
    try {
      await api.put(`/applications/${id}`, { currentStage: stage });
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering & Sorting
  const filteredApplications = applications
    .filter((app) => {
      const matchSearch =
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === '' || app.currentStage === statusFilter;
      const matchLocation =
        locationFilter === '' ||
        app.location.toLowerCase().includes(locationFilter.toLowerCase());
      return matchSearch && matchStatus && matchLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') {
        return new Date(b.applicationDate) - new Date(a.applicationDate);
      }
      if (sortBy === 'date-asc') {
        return new Date(a.applicationDate) - new Date(b.applicationDate);
      }
      if (sortBy === 'package-desc') {
        return b.packageOffered - a.packageOffered;
      }
      if (sortBy === 'company-asc') {
        return a.companyName.localeCompare(b.companyName);
      }
      return 0;
    });

  const getStageColorClass = (stage) => {
    const map = {
      Interested: 'stage-interested',
      Applied: 'stage-applied',
      'Online Assessment': 'stage-oa',
      'Technical Interview': 'stage-tech',
      'HR Interview': 'stage-hr',
      'Offer Received': 'stage-offered',
      Rejected: 'stage-rejected',
    };
    return map[stage] || '';
  };

  const getStageTextColor = (stage) => {
    const map = {
      Interested: 'var(--stage-text-interested)',
      Applied: 'var(--stage-text-applied)',
      'Online Assessment': 'var(--stage-text-oa)',
      'Technical Interview': 'var(--stage-text-tech)',
      'HR Interview': 'var(--stage-text-hr)',
      'Offer Received': 'var(--stage-text-offered)',
      Rejected: 'var(--stage-text-rejected)',
    };
    return map[stage] || 'inherit';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Placement Tracker</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Organize, update, and manage your pipeline of active placement applications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={() => exportApplicationsToPdf(filteredApplications)}>
            <FileDown size={18} /> Export PDF
          </button>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={18} /> Add Application
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <Search
              size={18}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
              }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search by company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Stages</option>
              {stages.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              className="form-input"
              placeholder="Filter by location..."
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>

          <div>
            <select
              className="form-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date-desc">Date (Newest First)</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="package-desc">Package (High to Low)</option>
              <option value="company-asc">Company (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px',
        }}
      >
        <button
          className={`btn ${activeTab === 'table' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('table')}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          <TableIcon size={16} /> Table View
        </button>
        <button
          className={`btn ${activeTab === 'kanban' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('kanban')}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          <KanbanSquare size={16} /> Kanban Board
        </button>
        <button
          className={`btn ${activeTab === 'timeline' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('timeline')}
          style={{ padding: '8px 16px', fontSize: '14px' }}
        >
          <GitFork size={16} /> Smart Timeline
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading applications...</h3>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px' }}>
          <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h3>No Applications Tracked</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            Get started by adding your first job application.
          </p>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add Application
          </button>
        </div>
      ) : (
        <div>
          {/* 1. TABLE VIEW */}
          {activeTab === 'table' && (
            <div className="glass-panel table-container" style={{ padding: 0 }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Package (LPA)</th>
                    <th>Location</th>
                    <th>Applied Date</th>
                    <th>Stage</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong>{app.companyName}</strong>
                      </td>
                      <td>{app.role}</td>
                      <td>
                        {app.packageOffered ? (
                          <span style={{ fontWeight: '500' }}>{app.packageOffered} LPA</span>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                        )}
                      </td>
                      <td>
                        {app.location ? (
                          <div className="flex-align-center" style={{ gap: '4px', fontSize: '13px' }}>
                            <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                            {app.location}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>N/A</span>
                        )}
                      </td>
                      <td>
                        <div className="flex-align-center" style={{ gap: '4px', fontSize: '13px' }}>
                          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
                          {new Date(app.applicationDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <span className={`tag-badge ${getStageColorClass(app.currentStage)}`}>
                          {app.currentStage}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => openEditModal(app)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-primary)',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--color-danger)',
                              cursor: 'pointer',
                              padding: '4px',
                            }}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 2. KANBAN BOARD */}
          {activeTab === 'kanban' && (
            <div className="kanban-board">
              {stages.map((stage) => {
                const stageApps = filteredApplications.filter((app) => app.currentStage === stage);
                return (
                  <div
                    key={stage}
                    className="kanban-column"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, stage)}
                  >
                    <div className="kanban-column-header">
                      <span className="kanban-column-title" style={{ color: getStageTextColor(stage) }}>
                        {stage}
                      </span>
                      <span className={`stage-badge ${getStageColorClass(stage)}`}>{stageApps.length}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
                      {stageApps.map((app) => (
                        <div
                          key={app._id}
                          className="glass-card"
                          style={{ padding: '12px', cursor: 'grab', background: 'var(--bg-panel)' }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, app._id)}
                        >
                          <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px' }}>
                            {app.companyName}
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            {app.role}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--text-muted)' }}>
                            <span>{app.packageOffered ? `${app.packageOffered} LPA` : 'N/A'}</span>
                            <span>{new Date(app.applicationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                          </div>

                          <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)', margin: '8px 0' }} />
                          
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <select
                              value={app.currentStage}
                              onChange={(e) => handleStageChange(app._id, e.target.value)}
                              style={{
                                fontSize: '11px',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-secondary)',
                                color: 'var(--text-primary)',
                                outline: 'none',
                              }}
                            >
                              {stages.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => handleDelete(app._id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--color-danger)',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 3. SMART TIMELINE VIEW */}
          {activeTab === 'timeline' && (
            <div className="timeline-container">
              <div className="timeline-line"></div>
              {filteredApplications.map((app) => (
                <div key={app._id} className="timeline-item">
                  <div className="timeline-dot" style={{ borderColor: getStageTextColor(app.currentStage) }}></div>
                  <div className="timeline-date">
                    {new Date(app.applicationDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="timeline-panel glass-card" style={{ padding: '16px' }}>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px' }}>{app.companyName}</h3>
                      <span className={`tag-badge ${getStageColorClass(app.currentStage)}`}>
                        {app.currentStage}
                      </span>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '8px' }}>
                      Role: <strong>{app.role}</strong>
                    </p>

                    <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {app.packageOffered ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <DollarSign size={14} /> {app.packageOffered} LPA
                        </div>
                      ) : null}
                      {app.location ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={14} /> {app.location}
                        </div>
                      ) : null}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                      <button
                        onClick={() => openEditModal(app)}
                        className="btn btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal Popup Dialog */}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>
              {editingApp ? 'Edit Application' : 'Add Application'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
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
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Package (LPA)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    className="form-input"
                    value={packageOffered}
                    onChange={(e) => setPackageOffered(e.target.value)}
                    placeholder="e.g. 15"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bangalore"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Application Date</label>
                  <input
                    type="date"
                    className="form-input"
                    value={applicationDate}
                    onChange={(e) => setApplicationDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Current Stage</label>
                  <select
                    className="form-input"
                    value={currentStage}
                    onChange={(e) => setCurrentStage(e.target.value)}
                  >
                    {stages.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationTracker;
