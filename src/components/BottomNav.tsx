import { Home, FileText, PlusCircle, Users, BarChart3 } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/invoices', icon: FileText, label: 'Invoices' },
  { path: '/create', icon: PlusCircle, label: 'Create', isMain: true },
  { path: '/customers', icon: Users, label: 'Parties' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
];

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card shadow-lg">
      <div className="mx-auto flex max-w-lg items-center justify-around py-1">
        {navItems.map(({ path, icon: Icon, label, isMain }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 transition-colors ${
                isMain
                  ? 'relative -mt-5'
                  : ''
              }`}
            >
              {isMain ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
              ) : (
                <Icon
                  className={`h-5 w-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
              )}
              <span
                className={`text-[10px] font-medium ${
                  isMain
                    ? 'text-primary'
                    : isActive
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
