import { Inbox } from 'lucide-react'

export default function EmptyState({ title = 'No data found', subtitle, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="bg-canvas-100 p-5 rounded-2xl mb-4">
        <Icon size={32} className="text-canvas-400" />
      </div>
      <p className="text-slate-500 font-semibold">{title}</p>
      {subtitle && <p className="text-canvas-400 text-sm mt-1">{subtitle}</p>}
    </div>
  )
}
