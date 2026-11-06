export default function makeSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // space aur special chars ko '-' bana do
    .replace(/^-+|-+$/g, '') // shuru aur end ke '-' hata do
}