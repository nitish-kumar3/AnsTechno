import { useState } from 'react'
import FormField, { inputClass } from '../ui/FormField'
import ImageUpload from './ImageUpload'
import MarkdownEditor from './MarkdownEditor'

function Choice({ options, value, onChange }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`rounded-xl py-2.5 text-sm font-semibold transition ${
            value === o.value ? 'bg-brand-500 text-black' : 'text-white/70 hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export default function PostForm({ post, saving, serverError, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    lang: post?.lang || 'en',
    category: post?.category || '',
    tagsText: (post?.tags || []).join(', '),
    excerpt: post?.excerpt || '',
    coverImage: post?.coverImage || '',
    content: post?.content || '',
    author: post?.author || 'Anstech Team',
    status: post?.status || 'draft',
  })
  const [error, setError] = useState('')

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    if (form.title.trim().length < 3) return setError('Article ka title likho')
    if (form.status === 'published' && form.content.trim().length < 50) {
      return setError('Publish karne ke liye kam se kam 50 characters ka content likho')
    }
    setError('')

    onSave({
      title: form.title.trim(),
      slug: form.slug.trim(),
      lang: form.lang,
      category: form.category.trim(),
      tags: form.tagsText
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      excerpt: form.excerpt.trim(),
      coverImage: form.coverImage,
      content: form.content,
      author: form.author.trim(),
      status: form.status,
    })
  }

  const shownError = error || serverError

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {shownError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {shownError}
        </div>
      )}

      <FormField label="Title">
        <input
          className={inputClass}
          placeholder="5 ways a small shop can sell online"
          value={form.title}
          onChange={set('title')}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-1.5 text-sm font-medium text-white/80">Language</p>
          <Choice
            value={form.lang}
            onChange={(lang) => setForm({ ...form, lang })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'hi', label: 'हिंदी' },
            ]}
          />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-medium text-white/80">Status</p>
          <Choice
            value={form.status}
            onChange={(status) => setForm({ ...form, status })}
            options={[
              { value: 'draft', label: 'Draft' },
              { value: 'published', label: 'Published' },
            ]}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Category" optional>
          <input
            className={inputClass}
            placeholder="Marketing"
            value={form.category}
            onChange={set('category')}
          />
        </FormField>
        <FormField label="Tags (comma se alag karo)" optional>
          <input
            className={inputClass}
            placeholder="website, small business, seo"
            value={form.tagsText}
            onChange={set('tagsText')}
          />
        </FormField>
      </div>

      <ImageUpload
        label="Cover photo (16:9 best dikhegi)"
        value={form.coverImage}
        onChange={(url) => setForm({ ...form, coverImage: url })}
      />

      <FormField label="Short summary (Google aur card me dikhega)" optional>
        <textarea
          rows={2}
          maxLength={300}
          className={`${inputClass} resize-none`}
          placeholder="Khali chhodoge to article se apne aap ban jayega"
          value={form.excerpt}
          onChange={set('excerpt')}
        />
      </FormField>

      <MarkdownEditor value={form.content} onChange={(content) => setForm({ ...form, content })} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Author" optional>
          <input className={inputClass} value={form.author} onChange={set('author')} />
        </FormField>
        <FormField label="Link ka naam (slug)" optional>
          <input
            className={inputClass}
            placeholder="Khali = title se apne aap"
            value={form.slug}
            onChange={set('slug')}
          />
          <span className="mt-1.5 block text-xs text-white/40">
            Publish ke baad badloge to purane links tootenge. Hindi title me khali chhodna theek hai.
          </span>
        </FormField>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold transition hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-brand-300 disabled:opacity-70 sm:flex-none"
        >
          {saving ? 'Saving...' : post ? 'Save changes' : form.status === 'published' ? 'Publish article' : 'Save draft'}
        </button>
      </div>
    </form>
  )
}