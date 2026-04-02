import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-canvas-200 rounded-2xl p-6 max-w-sm w-full shadow-auth-panel animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-coral-500/10 p-2 rounded-xl">
            <AlertTriangle size={19} className="text-coral-500" />
          </div>
          <h3 className="font-semibold text-slate-800">Confirm Action</h3>
        </div>
        <p className="text-slate-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn-danger">Delete</button>
        </div>
      </div>
    </div>
  )
}
