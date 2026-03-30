import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, Activity, ListChecks, FolderOpen,
  Settings, HelpCircle, Search, Bell, ChevronDown, LogOut,
  Menu, X, Brain,
} from 'lucide-react';
import { useDoctor } from '../../contexts/DoctorContext';
import { cn } from '../../utils/cn';

const sidebarLinks = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/patients', label: 'Patients', icon: Users },
  { path: '/questions', label: 'Question Bank', icon: ListChecks },
  { path: '/settings', label: 'Settings', icon: Settings },
  { path: '/help', label: 'Help & Support', icon: HelpCircle },
];

export default function DoctorDashboardLayout({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentDoctor, logout, sessions } = useDoctor();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeSessions = sessions?.filter((s) => s.status === 'in-progress').length || 0;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── SIDEBAR (desktop) ── */}
      <aside className="hidden lg:flex flex-col w-60 bg-surface border-r border-border/60 shrink-0">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 px-5 h-16 border-b border-border/40">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center">
            <Brain size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold text-navy-dark tracking-tight">Bhul Rakshak</span>
        </Link>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-deep-teal/8 text-deep-teal'
                    : 'text-text-muted hover:text-text-primary hover:bg-muted/50',
                )}
              >
                <Icon size={18} />
                {link.label}
                {link.label === 'Patients' && activeSessions > 0 && (
                  <span className="ml-auto bg-coral/15 text-coral text-[10px] font-bold px-1.5 py-0.5 rounded-full">{activeSessions}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Doctor mini-profile */}
        <div className="px-3 py-3 border-t border-border/40">
          <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => navigate('/profile')}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentDoctor?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'Dr'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-primary truncate">{currentDoctor?.fullName || 'Doctor'}</p>
              <p className="text-[10px] text-text-muted truncate">{currentDoctor?.specialty || ''}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-navy-dark/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="fixed left-0 top-0 bottom-0 w-60 bg-surface border-r border-border/60 z-50 lg:hidden flex flex-col">
              <div className="flex items-center justify-between px-5 h-16 border-b border-border/40">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center">
                    <Brain size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-bold text-navy-dark">Bhul Rakshak</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 text-text-muted cursor-pointer"><X size={20} /></button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-0.5">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.path || (link.path !== '/dashboard' && pathname.startsWith(link.path));
                  return (
                    <Link key={link.path} to={link.path} onClick={() => setSidebarOpen(false)} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all', isActive ? 'bg-deep-teal/8 text-deep-teal' : 'text-text-muted hover:text-text-primary hover:bg-muted/50')}>
                      <Icon size={18} />{link.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-surface/80 backdrop-blur-md border-b border-border/40 flex items-center gap-4 px-4 lg:px-6 shrink-0 z-10">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-text-muted cursor-pointer"><Menu size={20} /></button>

          {/* Hospital name */}
          <span className="hidden md:block text-sm font-semibold text-text-muted truncate max-w-[200px]">{currentDoctor?.hospital || ''}</span>

          {/* Search */}
          <div className="flex-1 max-w-md mx-auto relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-border/60 bg-muted/30 text-sm outline-none focus:border-deep-teal focus:ring-1 focus:ring-deep-teal/15 transition-all"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-text-muted hover:bg-muted/50 transition-colors cursor-pointer">
            <Bell size={18} />
            {activeSessions > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-coral rounded-full" />}
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white text-xs font-bold">
                {currentDoctor?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'Dr'}
              </div>
              <ChevronDown size={14} className="text-text-muted hidden sm:block" />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-0 top-12 w-48 bg-surface rounded-xl border border-border/60 shadow-xl z-50 py-1.5">
                  <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-muted/50 transition-colors">Profile</Link>
                  <Link to="/settings" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-text-primary hover:bg-muted/50 transition-colors">Settings</Link>
                  <hr className="my-1 border-border/40" />
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-error hover:bg-error/5 transition-colors flex items-center gap-2 cursor-pointer">
                    <LogOut size={14} /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
