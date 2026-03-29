import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Activity, User } from 'lucide-react';
import { cn } from '../../utils/cn';

const tabs = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/questions', label: 'Questions', icon: Activity },
  { to: '/profile', label: 'Profile', icon: User },
];

/**
 * Bottom tab bar for mobile in doctor authenticated views.
 * Hidden on public pages and during active sessions.
 */
export default function MobileTabBar() {
  const { pathname } = useLocation();

  // Only show on authenticated app pages
  const showPaths = ['/dashboard', '/patients', '/questions', '/profile', '/settings', '/help'];
  const shouldShow = showPaths.some((p) => pathname.startsWith(p));
  if (!shouldShow) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border/40 safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors',
                  isActive ? 'text-deep-teal' : 'text-text-muted',
                )
              }
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
