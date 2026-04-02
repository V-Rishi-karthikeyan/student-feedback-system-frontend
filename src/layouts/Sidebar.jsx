import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, MessageSquare, BookOpen, Users,
  BarChart3, PlusCircle, LogOut, Zap
} from 'lucide-react'

const NAV = {
  STUDENT: [
    { to: '/student/dashboard',       icon: LayoutDashboard, label: 'Dashboard'       },
    { to: '/student/submit-feedback', icon: PlusCircle,      label: 'Submit Feedback' },
    { to: '/student/my-feedback',     icon: MessageSquare,   label: 'My Feedback'     },
  ],
  TEACHER: [
    { to: '/teacher/dashboard',       icon: LayoutDashboard, label: 'Dashboard'       },
    { to: '/teacher/course-feedback', icon: BookOpen,        label: 'Course Feedback' },
    { to: '/teacher/report',          icon: BarChart3,       label: 'My Report'       },
  ],
  ADMIN: [
    { to: '/admin/dashboard',         icon: LayoutDashboard, label: 'Dashboard'       },
    { to: '/admin/feedback',          icon: MessageSquare,   label: 'All Feedback'    },
    { to: '/admin/users',             icon: Users,           label: 'Users'           },
    { to: '/admin/courses',           icon: BookOpen,        label: 'Courses'         },
  ],
}

const ROLE_BADGE = {
  STUDENT: 'bg-emerald-100 text-emerald-700',
  TEACHER: 'bg-yellow-100 text-yellow-700',
  ADMIN:   'bg-navy-100 text-navy-700',
}

export default function Sidebar({ collapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const links = NAV[user?.role] || []

  const handleLogout = () => { logout(); navigate('/login') }
  const initials = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase()

  return (
    <aside className={`
      fixed left-0 top-0 h-screen z-30 flex flex-col
      bg-white border-r border-canvas-200 shadow-sm
      transition-all duration-300
      ${collapsed ? 'w-16' : 'w-60'}
    `}>

      {/* Logo */}
      <div className={`flex items-center border-b border-canvas-200 ${collapsed ? 'justify-center px-4 py-5' : 'gap-2.5 px-5 py-5'}`}>
        <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-navy-700 flex items-center justify-center shadow-sm">
          <Zap size={15} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-navy-900 text-lg tracking-tight">
            Edu<span className="text-navy-500">Pulse</span>
          </span>
        )}
      </div>

      {/* Role chip */}
      {!collapsed && (
        <div className="px-4 pt-4 pb-1">
          <p className="text-[10px] font-semibold text-canvas-400 uppercase tracking-widest mb-2">Navigation</p>
        </div>
      )}

      {/* Links */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) => isActive ? 'nav-item-active' : 'nav-item'}
          >
            <Icon size={17} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-2 pb-3 pt-2 border-t border-canvas-200">
        {!collapsed && (
          <div className="px-3 py-3 rounded-xl bg-canvas-50 border border-canvas-200 mb-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-navy-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-700 truncate">{user?.name}</p>
                <p className="text-[10px] text-canvas-500 truncate">{user?.email}</p>
              </div>
            </div>
            <span className={`badge mt-2 text-[10px] ${ROLE_BADGE[user?.role]}`}>{user?.role}</span>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-coral-500 hover:text-coral-600 hover:bg-coral-50"
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
