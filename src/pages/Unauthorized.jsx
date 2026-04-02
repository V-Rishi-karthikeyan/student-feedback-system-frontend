import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'

export default function Unauthorized() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-canvas-50 flex items-center justify-center p-4">
      <div className="text-center animate-slide-up card p-10">
        <div className="w-14 h-14 rounded-2xl bg-coral-500/10 flex items-center justify-center mx-auto mb-4">
          <ShieldOff size={28} className="text-coral-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 font-display mb-2">Access Denied</h1>
        <p className="text-slate-500 text-sm mb-6">You don't have permission to view this page.</p>
        <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
      </div>
    </div>
  )
}
