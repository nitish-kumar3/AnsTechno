import { useCallback, useEffect, useState } from 'react'
import api from '../services/api'
import { contact as defaultContact } from '../data/contact'

// Ek baar aaya data yaad rakhte hain, to dusre page par turant dikhta hai
const cache = {}

// Backend me 'slug' hota hai, cards 'id' dhundte hain. Dono jod dete hain
const withId = (list) => list.map((item) => ({ ...item, id: item.slug }))

// Ye functions bahar likhe hain taaki har baar naye na bane
const pickServices = (res) => withId(res.services)
const pickProjects = (res) => withId(res.projects)
const pickOpenings = (res) => withId(res.openings)
const pickTestimonials = (res) => res.testimonials
const pickSettings = (res) => res.settings
const pickItems = (res) => res.items

function useApi(url, pick) {
  const [data, setData] = useState(cache[url] ?? null)
  const [loading, setLoading] = useState(!cache[url])
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setError('')
    api
      .get(url)
      .then((res) => {
        cache[url] = pick(res.data)
        setData(cache[url])
      })
      .catch((err) => {
        // Pehle se data dikh raha hai to error mat dikhao
        if (!cache[url]) {
          setError(err.response?.data?.message || 'Could not load. Please check your connection.')
        }
      })
      .finally(() => setLoading(false))
  }, [url, pick])

  useEffect(() => {
    load()
  }, [load])

  const reload = () => {
    setLoading(true)
    load()
  }

  return { data, loading, error, reload }
}

export const useServices = () => useApi('/services', pickServices)
export const useProjects = () => useApi('/projects', pickProjects)
export const useOpenings = () => useApi('/openings', pickOpenings)
export const useTestimonials = () => useApi('/testimonials', pickTestimonials)
export const useImpact = () => useApi('/impact', pickItems)
export const useStories = () => useApi('/stories', pickItems)
export const useCredentials = () => useApi('/credentials', pickItems)
export const useTalent = () => useApi('/talent', pickItems)

// Contact info: pehle default dikhti hai, API se aate hi asli wali aa jati hai
export function useSettings() {
  const { data } = useApi('/settings', pickSettings)
  return { ...defaultContact, ...(data || {}) }
}