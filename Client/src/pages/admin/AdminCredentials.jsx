import ManagePage from '../../components/admin/ManagePage'
import CredentialForm from '../../components/admin/CredentialForm'
import { getBlockIcon } from '../../utils/blockIcons'

export default function AdminCredentials() {
  return (
    <ManagePage
      title="Trust and credentials"
      subtitle="Registrations, certifications aur govt kaam ka anubhav (Our Story page par)."
      noun="Credential"
      addLabel="Add credential"
      listUrl="/credentials/admin/all"
      baseUrl="/credentials"
      nameOf={(c) => c.title}
      searchText={(c) => `${c.title} ${c.titleHi} ${c.detail}`}
      emptyHint="Jo asli me tumhare paas hai wahi 'Add credential' se daalo."
      row={(c) => ({
        icon: getBlockIcon(c.icon),
        title: c.title,
        subtitle: c.detail,
      })}
      Form={CredentialForm}
    />
  )
}