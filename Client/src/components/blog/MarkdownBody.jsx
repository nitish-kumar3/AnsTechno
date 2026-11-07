import { Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import assetUrl from '../../utils/assetUrl'

const components = {
  // /services jaise andar ke link SPA me khulein, baahar ke naye tab me
  a: ({ href = '', children }) =>
    href.startsWith('/') ? (
      <Link to={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer noopener">
        {children}
      </a>
    ),
  img: ({ src = '', alt = '' }) => <img src={assetUrl(src)} alt={alt} loading="lazy" />,
}

export default function MarkdownBody({ children }) {
  return (
    <div className="blog-body">
      <ReactMarkdown components={components}>{children || ''}</ReactMarkdown>
    </div>
  )
}