import { Menu, Bell, ChevronRight, Search } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function getBreadcrumb(pathname) {
  return pathname.split('/').filter(Boolean)
    .map(p => p.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()))
}

export default function Navbar({ onMenuToggle, sidebarWidth }) {
  const location = useLocation()
  const { user }  = useAuth()
  const crumbs    = getBreadcrumb(location.pathname)
  const initials  = user?.name?.split(' ').map(n => n[0]).slice(0,2).join('').toUpperCase() || '?'

  return (
    <header
      className="fixed top-0 right-0 z-20 flex items-center justify-between px-5 h-14
                 bg-white border-b border-canvas-200 shadow-sm"
      style={{ left: sidebarWidth }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-lg text-canvas-500 hover:text-slate-700 hover:bg-canvas-100 transition-colors"
        >
          <Menu size={17} />
        </button>
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={13} className="text-canvas-300" />}
              <span className={i === crumbs.length - 1
                ? 'text-slate-700 font-semibold'
                : 'text-canvas-400 font-medium'}>
                {c}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-canvas-500 hover:text-slate-700 hover:bg-canvas-100 transition-colors">
          <Bell size={17} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-navy-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-xl bg-navy-700 flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
