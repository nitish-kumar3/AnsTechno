import ManagePage from '../../components/admin/ManagePage'
import ImpactForm from '../../components/admin/ImpactForm'
import { getBlockIcon } from '../../utils/blockIcons'

export default function AdminImpact() {
  return (
    <ManagePage
      title="Impact numbers"
      subtitle="Home page par ginte hue numbers. Jab tak koi number nahi, wo section chhupa rahega."
      noun="Number"
      addLabel="Add number"
      listUrl="/impact/admin/all"
      baseUrl="/impact"
      nameOf={(i) => i.label}
      searchText={(i) => `${i.label} ${i.labelHi}`}
      emptyHint="Asli numbers aate hi 'Add number' se daal do."
      row={(i) => ({
        icon: getBlockIcon(i.icon),
        title: `${new Intl.NumberFormat('en-IN').format(i.value)}${i.suffix} ${i.label}`,
        subtitle: i.labelHi,
      })}
      Form={ImpactForm}
    />
  )
}