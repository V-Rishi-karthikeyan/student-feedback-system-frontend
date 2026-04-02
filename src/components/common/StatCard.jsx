export default function StatCard({ label, value, icon: Icon, color = 'navy', trend }) {
  const colorMap = {
    navy:    { bg: 'bg-navy-50',    text: 'text-navy-600',    border: 'border-navy-100'    },
    teal:    { bg: 'bg-teal-50',    text: 'text-teal-600',    border: 'border-teal-100'    },
    amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100'   },
    rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100'    },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100' },
    violet:  { bg: 'bg-violet-50',  text: 'text-violet-600',  border: 'border-violet-100'  },
  }
  const c = colorMap[color] || colorMap.navy

  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-canvas-500 uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-slate-800 font-display">{value ?? '—'}</p>
          {trend && <p className="text-xs text-canvas-400 mt-1">{trend}</p>}
        </div>
        {Icon && (
          <div className={`${c.bg} ${c.text} border ${c.border} p-2.5 rounded-xl`}>
            <Icon size={20} />
          </div>
        )}
      </div>
    </div>
  )
}
