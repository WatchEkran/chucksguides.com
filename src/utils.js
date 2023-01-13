export function setPageTitle(text) {
  document.title = text ? `${text} - Chuck's Guides` : `Chuck's Guides`
}

export function getPageNumberFromHash(hash) {
  return hash ? parseInt(hash.split('page')[1]) : 1
}
