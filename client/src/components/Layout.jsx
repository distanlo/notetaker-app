import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children, onLogout }) {
  const location = useLocation();

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-brand">NoteTaker</div>
        <div className="nav-links">
          <Link to="/notes" className={location.pathname === '/notes' ? 'active' : ''}>
            Notes
          </Link>
          <Link to="/todos" className={location.pathname === '/todos' ? 'active' : ''}>
            Todos
          </Link>
          <Link to="/tags" className={location.pathname.startsWith('/tags') ? 'active' : ''}>
            Tags
          </Link>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
