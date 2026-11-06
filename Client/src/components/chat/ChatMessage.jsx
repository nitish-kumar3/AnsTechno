import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

// Bot ke text me /estimate jaise page naam ko link bana deta hai
const pages = /(\/(?:services|portfolio|career|estimate|online-check|lets-connect|our-story|verify))(?![\w-])/g

function linkify(text, onNavigate) {
  return text.split(pages).map((part, i) =>
    i % 2 === 1 ? (
      <Link
        key={i}
        to={part}
        onClick={onNavigate}
        className="font-semibold text-brand-300 underline underline-offset-2"
      >
        {part}
      </Link>
    ) : (
      part
    )
  )
}

export default function ChatMessage({ role, text, onNavigate, children }) {
  if (role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-brand-500 px-4 py-2.5 text-sm text-black">
          {text}
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-end gap-2"
    >
      <span className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-linear-to-br from-brand-300 to-brand-600 text-black">
        <Sparkles size={14} />
      </span>
      <div className="min-w-0 max-w-[85%]">
        <div className="whitespace-pre-wrap break-words rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm leading-relaxed text-white/90">
          {linkify(text, onNavigate)}
        </div>
        {children}
      </div>
    </motion.div>
  )
}