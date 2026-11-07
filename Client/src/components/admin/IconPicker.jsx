import { getBlockIcon } from '../../utils/blockIcons'

export default function IconPicker({ keys, value, onChange, label = 'Icon' }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-white/80">{label}</p>
      <div className="flex flex-wrap gap-2">
        {keys.map((key) => {
          const Icon = getBlockIcon(key)
          const selected = value === key
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              title={key}
              className={`grid h-12 w-12 place-items-center rounded-2xl border transition ${
                selected
                  ? 'border-brand-500 bg-brand-500 text-black'
                  : 'border-white/10 bg-white/5 text-white/70 hover:border-brand-500/40'
              }`}
            >
              <Icon size={22} />
            </button>
          )
        })}
      </div>
    </div>
  )
}