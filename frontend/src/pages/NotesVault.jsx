import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { FileText, Plus, Trash2, Edit2, Search, SlidersHorizontal, Tag } from 'lucide-react';

const NotesVault = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');

  const categories = ['General', 'Technical', 'HR', 'Interview'];

  const fetchNotes = async () => {
    try {
      const res = await api.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const openAddModal = () => {
    setEditingNote(null);
    setTitle('');
    setContent('');
    setCategory('General');
    setIsModalOpen(true);
  };

  const openEditModal = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { title, content, category };
    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote._id}`, payload);
      } else {
        await api.post('/notes', payload);
      }
      setIsModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await api.delete(`/notes/${id}`);
        fetchNotes();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getTagClass = (cat) => {
    const map = {
      Technical: 'tag-tech',
      HR: 'tag-hr',
      Interview: 'tag-interview',
      General: 'tag-general',
    };
    return map[cat] || 'tag-general';
  };

  return (
    <div>
      {/* Header */}
      <div className="flex-between" style={{ marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Notes Vault</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Organize core technical definitions, cheat sheets, and prepared HR answers.
          </p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> Add Note
        </button>
      </div>

      {/* Filter and Search */}
      <div className="glass-panel" style={{ padding: '16px', marginBottom: '24px', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', width: '320px' }}>
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
            placeholder="Search notes content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`btn ${categoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 14px', fontSize: '13px', borderRadius: '20px' }}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3>Loading notes vault...</h3>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '60px' }}>
          <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px', opacity: 0.5 }} />
          <h3>No Notes Found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px', marginBottom: '20px' }}>
            Store interview reminders, system design summaries, or behavioral answers here.
          </p>
          <button className="btn btn-primary" onClick={openAddModal}>
            <Plus size={16} /> Add Note
          </button>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note._id} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyBlock: 'space-between', minHeight: '180px' }}>
              <div>
                <div className="flex-between" style={{ marginBottom: '10px' }}>
                  <span className={`tag-badge ${getTagClass(note.category)}`}>
                    {note.category}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => openEditModal(note)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                      title="Edit"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--color-danger)', cursor: 'pointer', padding: '2px' }}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <h3 style={{ fontSize: '17px', marginBottom: '8px', lineHeight: '1.3' }}>{note.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '12px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'right' }}>
                Saved: {new Date(note.createdAt).toLocaleDateString()}
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
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', boxShadow: 'var(--shadow-lg)' }}>
            <h2 style={{ fontSize: '22px', marginBottom: '20px' }}>
              {editingNote ? 'Edit Vault Note' : 'Add Vault Note'}
            </h2>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Note Title *</label>
                <input
                  type="text"
                  className="form-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. STAR Method (Behavioral)"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Note Content *</label>
                <textarea
                  className="form-input"
                  style={{ height: '180px', resize: 'vertical' }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type notes detail..."
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesVault;
