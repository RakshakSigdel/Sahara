import { NavLink } from 'react-router-dom';
import {
  Home,
  Activity,
  Clock,
  BookOpen,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import MobileTabBar from './MobileTabBar';

/**
 * Dashboard layout with a fixed sidebar (desktop) and bottom tab bar (mobile).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {{name?: string, email?: string, avatar?: string}} [props.user]
 */

const sidebarLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/screen', label: 'Screening', icon: Activity },
  { to: '/history', label: 'History', icon: Clock },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

function DashboardLayout({ children, user }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0',
          'w-60 bg-surface border-r border-border z-30',
        )}
      >
        {/* User section */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-border">
          {/* Avatar */}
          <div className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-deep-teal to-sage flex items-center justify-center text-white font-semibold text-sm">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || 'User'}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              (user?.name?.[0] || 'U').toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">
              {user?.name || 'User'}
            </p>
            {user?.email && (
              <p className="text-xs text-text-muted truncate">{user.email}</p>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium',
                    'transition-colors duration-150',
                    isActive
                      ? 'text-deep-teal bg-deep-teal/8'
                      : 'text-text-secondary hover:text-text-primary hover:bg-muted',
                  )
                }
              >
                <Icon size={18} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 border-t border-border pt-3">
          <button
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded text-sm font-medium',
              'text-text-secondary hover:text-coral hover:bg-coral/5',
              'transition-colors duration-150',
              'cursor-pointer',
            )}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <main
        className={cn(
          'min-h-screen',
          'lg:ml-60', // offset by sidebar width on desktop
          'pb-20 md:pb-0', // bottom padding for mobile tab bar
        )}
      >
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <MobileTabBar />
    </div>
  );
}

DashboardLayout.displayName = 'DashboardLayout';

export { DashboardLayout };
export default DashboardLayout;
