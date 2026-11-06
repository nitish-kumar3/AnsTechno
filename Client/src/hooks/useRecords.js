import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../services/api'
import { useToast } from './useToast'

export function useRecords({ url, listKey, itemKey, params, label, onChange }) {
  const { toast, show } = useToast()
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const lastRequest = useRef(0)

  const filterKey = JSON.stringify(params)

  // Filter ya search badle to wapas page 1 par
  useEffect(() => {
    setPage(1)
  }, [filterKey])

  const load = useCallback(async () => {
    const id = ++lastRequest.current
    setLoading(true)
    try {
      const { data } = await api.get(url, {
        params: { ...JSON.parse(filterKey), page, limit: 15 },
      })
      if (id !== lastRequest.current) return // purana jawab hai, ignore
      setItems(data[listKey])
      setPages(data.pages || 1)
      setTotal(data.total || 0)
      setError('')
    } catch (err) {
      if (id !== lastRequest.current) return
      setError(err.response?.data?.message || `Could not load ${label.toLowerCase()}s`)
    } finally {
      if (id === lastRequest.current) setLoading(false)
    }
  }, [url, listKey, filterKey, page, label])

  useEffect(() => {
    load()
  }, [load])

  // Stage / status / notes badlo. Naya record wapas deta hai (fail hone par null)
  const update = async (id, payload) => {
    try {
      const { data } = await api.put(`${url}/${id}`, payload)
      const record = data[itemKey]
      setItems((list) => list.map((x) => (x._id === id ? record : x)))
      show('Saved')
      if (onChange) onChange()
      return record
    } catch (err) {
      show(err.response?.data?.message || 'Could not save', 'error')
      return null
    }
  }

  const remove = async (id) => {
    setBusy(true)
    try {
      await api.delete(`${url}/${id}`)
      show(`${label} deleted`)
      if (onChange) onChange()
      // Page ka akhri item tha to pichhle page par jao
      if (items.length === 1 && page > 1) setPage(page - 1)
      else await load()
      return true
    } catch {
      show('Could not delete', 'error')
      return false
    } finally {
      setBusy(false)
    }
  }

  // return { items, page, pages, total, loading, error, busy, toast, setPage, update, remove }
  return { items, page, pages, total, loading, error, busy, toast, show, reload: load, setPage, update, remove }
}