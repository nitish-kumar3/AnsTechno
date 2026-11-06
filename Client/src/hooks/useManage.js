import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { useToast } from './useToast'

// Admin ke list-pages ka common kaam: data lana, save, show/hide, delete
export function useManage({ listUrl, listKey, baseUrl, label, onChange }) {
  const { toast, show } = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  // Backend se list lao
  const load = useCallback(async () => {
    try {
      const { data } = await api.get(listUrl)
      setItems(data[listKey])
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || `Could not load ${label.toLowerCase()}s`)
    } finally {
      setLoading(false)
    }
  }, [listUrl, listKey, label])

  useEffect(() => {
    load()
  }, [load])

  // id nahi hai to naya banega, id hai to edit hoga. Kamyab hone par true deta hai
  const save = async (id, payload) => {
    setSaving(true)
    setFormError('')
    try {
      if (id) {
        await api.put(`${baseUrl}/${id}`, payload)
        show('Changes saved')
      } else {
        await api.post(baseUrl, payload)
        show(`${label} added`)
      }
      await load()
      if (onChange) onChange()
      return true
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save. Try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  // Website par dikhana / chhupana
  const toggleActive = async (item) => {
    try {
      await api.put(`${baseUrl}/${item._id}`, { isActive: !item.isActive })
      setItems((list) =>
        list.map((x) => (x._id === item._id ? { ...x, isActive: !x.isActive } : x))
      )
      show(item.isActive ? 'Hidden from website' : 'Now visible on website')
    } catch {
      show('Could not update', 'error')
    }
  }

  const remove = async (item) => {
    setBusy(true)
    try {
      await api.delete(`${baseUrl}/${item._id}`)
      show(`${label} deleted`)
      await load()
      if (onChange) onChange()
      return true
    } catch {
      show('Could not delete', 'error')
      return false
    } finally {
      setBusy(false)
    }
  }

  return { items, loading, error, saving, formError, setFormError, busy, toast, save, toggleActive, remove }
}