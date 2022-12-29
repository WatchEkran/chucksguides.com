import urlJoin from 'url-join'

// Get URL to files in the /src/assets folder.
export function getAssetUrl() {
  return urlJoin('/src/assets', ...arguments)
}

// Get URL to files on CDN.
export function getCdnUrl() {
  return urlJoin(import.meta.env.VITE_ASSETS_BASE_URL, ...arguments)
}