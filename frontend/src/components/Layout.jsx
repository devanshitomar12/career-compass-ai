import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Briefcase,
  Target,
  BookOpen,
  FileText,
  LogOut,
  Sun,
  Moon,
  Compass,
  User as UserIcon,
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Tracker', path: '/tracker', icon: <Briefcase size={20} /> },
    { name: 'Skill Gap', path: '/skill-gap', icon: <Target size={20} /> },
    { name: 'Interview Prep', path: '/interview-prep', icon: <BookOpen size={20} /> },
    { name: 'Notes Vault', path: '/notes', icon: <FileText size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <Compass size={28} style={{ color: 'var(--color-primary)' }} />
          <span className="logo-text">Career Compass</span>
        </div>

        <nav style={{ flex: 1 }}>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                  }
                  end={item.path === '/'}
                >
                  {item.icon}
                  <span className="nav-label">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span className="nav-label">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <div
            className="glass-card"
            style={{
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(255,255,255,0.03)',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--grad-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
            </div>
            <div className="nav-label" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
              <p style={{ fontSize: '14px', fontWeight: '600' }}>{user?.name}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Candidate</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-danger)',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
              }}
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Body */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
