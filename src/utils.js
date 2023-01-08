import urlJoin from 'url-join'

export function getGuideCssUrl(path) {
  const url = `/src/assets/${path}/guide.css`
  return new URL(url, import.meta.url).href
}

// Get URL to files on CDN.
export function getCdnUrl(path, filename) {
  return urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, path, hash, filename)
}
