import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  BellIcon, 
  DocumentTextIcon, 
  UserIcon, 
  CreditCardIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  let links = [];
  if (user.role === 'admin') {
    links = [
      { to: '/admin', label: 'Dashboard', icon: HomeIcon },
      { to: '/admin/users', label: 'Users', icon: UsersIcon },
      { to: '/admin/profile', label: 'Profile', icon: UserIcon },
      { to: '/admin/notifications', label: 'Notifications', icon: BellIcon },
    ];
  } else if (user.role === 'patient') {
    links = [
      { to: '/patient', label: 'Dashboard', icon: HomeIcon },
      { to: '/patient/applications', label: 'Applications', icon: DocumentTextIcon },
      { to: '/patient/profile', label: 'Profile', icon: UserIcon },
      { to: '/patient/payments', label: 'Payments', icon: CreditCardIcon },
      { to: '/patient/notifications', label: 'Notifications', icon: BellIcon },
    ];
  } else if (user.role === 'doctor') {
    links = [
      { to: '/doctor', label: 'Dashboard', icon: HomeIcon },
      { to: '/doctor/profile', label: 'Profile', icon: UserIcon },
      { to: '/doctor/availability', label: 'Availability', icon: CalendarIcon },
      { to: '/doctor/earnings', label: 'Earnings', icon: CurrencyDollarIcon },
      { to: '/doctor/notifications', label: 'Notifications', icon: BellIcon },
    ];
  }

  return (
    <aside className="sidebar pt-4">
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <link.icon className="w-5 h-5 mr-3" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;