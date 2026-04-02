import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  const styles = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-700',
    error:   'border-coral-300 bg-red-50 text-coral-600',
  }
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-card-lg
      ${styles[type]} transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <Icon size={17} />
      <span className="text-sm font-semibold">{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose,300) }} className="ml-1 opacity-50 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  )
}
