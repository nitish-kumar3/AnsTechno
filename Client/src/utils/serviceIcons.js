import {
  Bot,
  Camera,
  Globe,
  Layers,
  Monitor,
  Rocket,
  Server,
  Share2,
  Target,
  TrendingUp,
} from 'lucide-react'

const icons = {
  monitor: Monitor,
  server: Server,
  layers: Layers,
  globe: Globe,
  rocket: Rocket,
  bot: Bot,
  target: Target,
  camera: Camera,
  share: Share2,
  trending: TrendingUp,
}

export const getServiceIcon = (key) => icons[key] || Globe