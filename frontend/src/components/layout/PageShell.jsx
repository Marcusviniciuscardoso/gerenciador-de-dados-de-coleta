import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../decor/Illustrations';

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-xs tracking-[0.2em] uppercase font-semibold pb-1 border-b-2 transition ${
          isActive
            ? 'text-olive-dark border-olive'
            : 'text-olive-light/70 border-transparent hover:text-olive'
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function getInitials() {
  try {
    const raw = localStorage.getItem('usuarioNome') || '';
    if (!raw) return 'MS';
    const parts = raw.trim().split(/\s+/);
    return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || 'MS';
  } catch {
    return 'MS';
  }
}

export function Header() {
  const navigate = useNavigate();
  const initials = getInitials();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNome');
    navigate('/login');
  };

  return (
    <header className="bg-paper border-b border-tan/60">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/projetos" className="flex items-center gap-3">
          <Logo size={44} />
          <div className="leading-tight">
            <div className="font-serif text-xl text-olive-dark font-semibold">Lepidoptera</div>
            <div className="font-script text-sage-600 text-sm -mt-1">caderno de coleta científica</div>
          </div>
        </Link>

        <nav className="flex items-center gap-8">
          <NavItem to="/projetos">Projetos</NavItem>
          <NavItem to="/perfil">Perfil</NavItem>
          <NavItem to="/admin">Admin</NavItem>
          <button
            onClick={handleLogout}
            title="Sair"
            className="w-9 h-9 rounded-full bg-sage-200 border border-olive/30 text-olive-dark font-semibold text-xs hover:bg-sage-300 transition"
          >
            {initials}
          </button>
        </nav>
      </div>
    </header>
  );
}

export function PageBadge({ number, label }) {
  return (
    <div className="fixed top-4 right-4 z-40 font-script text-base text-olive-light/80 bg-paper-light border border-tan rounded-full px-4 py-1 shadow-card pointer-events-none">
      {number} · {label}
    </div>
  );
}

export default function PageShell({ children, badge, withHeader = true }) {
  return (
    <div className="min-h-screen bg-notebook">
      {withHeader && <Header />}
      {badge && <PageBadge number={badge.number} label={badge.label} />}
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

export function SectionHeading({ overline, title, className = '' }) {
  return (
    <div className={className}>
      {overline && <div className="font-script text-sage-600 text-lg mb-1">{overline}</div>}
      <h2 className="heading-serif text-2xl md:text-3xl flex items-center gap-3">
        {title}
        <span className="flex-1 h-px bg-gradient-to-r from-tan to-transparent" />
      </h2>
    </div>
  );
}

export function PageHeader({ overline, title, subtitle, actions, onBack, backLabel = 'Voltar' }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between mb-8 gap-6 flex-wrap">
      <div className="flex items-start gap-4">
        {onBack !== undefined && (
          <button
            onClick={onBack || (() => navigate(-1))}
            className="btn-secondary !py-1.5 !px-3 text-sm mt-1"
          >
            ← {backLabel}
          </button>
        )}
        <div>
          {overline && <div className="font-script text-sage-600 text-lg">{overline}</div>}
          <h1 className="heading-serif text-3xl md:text-4xl">{title}</h1>
          {subtitle && <p className="text-olive-light/80 mt-1">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
