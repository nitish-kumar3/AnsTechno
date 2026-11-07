import {
  Award,
  BadgeCheck,
  Briefcase,
  Building2,
  FileCheck,
  Globe,
  GraduationCap,
  Heart,
  Landmark,
  Rocket,
  ShieldCheck,
  Store,
  Trophy,
  Users,
} from 'lucide-react'

const icons = {
  users: Users,
  graduation: GraduationCap,
  store: Store,
  briefcase: Briefcase,
  rocket: Rocket,
  heart: Heart,
  trophy: Trophy,
  globe: Globe,
  shield: ShieldCheck,
  award: Award,
  landmark: Landmark,
  file: FileCheck,
  building: Building2,
  badge: BadgeCheck,
}

export const impactIconKeys = ['users', 'graduation', 'store', 'briefcase', 'rocket', 'heart', 'trophy', 'globe']
export const credentialIconKeys = ['shield', 'badge', 'award', 'landmark', 'file', 'building']

export const getBlockIcon = (key) => icons[key] || Award