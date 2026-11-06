import {
  Bell,
  Code,
  FileText,
  GraduationCap,
  MessageSquare,
  Play,
  ShieldCheck,
} from 'lucide-react'

const icons = {
  graduation: GraduationCap,
  chat: MessageSquare,
  video: Play,
  blog: FileText,
  shield: ShieldCheck,
  bell: Bell,
}

export const getProjectIcon = (key) => icons[key] || Code