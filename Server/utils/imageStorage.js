import { mkdir, writeFile } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const imageDir = fileURLToPath(new URL('../uploads/images/', import.meta.url))

const extensions = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

export async function saveImageLocally(file) {
  const extension = extensions[file.mimetype]
  if (!extension) throw new Error('Unsupported image type')

  const filename = `${randomUUID()}${extension}`
  await mkdir(imageDir, { recursive: true })
  await writeFile(join(imageDir, filename), file.buffer, { flag: 'wx' })

  return `/uploads/images/${filename}`
}
