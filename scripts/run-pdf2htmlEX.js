import { spawnSync } from 'child_process'

export default function runPdf2htmlEX(pathToPdf, outputFolder) {
  const args = [
    pathToPdf,
    '--embed=cfijo',
    '--split-pages=1',
    '--page-filename=%d.page.html',
    '--outline-filename=outline.html',
    '--css-filename=guide.css',
    '--bg-format=svg',
    '--optimize-text=1',
    `--dest-dir=${outputFolder}`,
    '--external-hint-tool=ttfautohint',
    '--turn-off-ligatures=1',
    'guide.html',
  ]

  const spawnedProcess = spawnSync('pdf2htmlEX', args, { stdio: 'inherit' })
  process.on('SIGINT', () => spawnedProcess.kill())
}

export function runPdf2htmlEXOld(pathToPdf, outputFolder) {
  const args = [
    pathToPdf,
    '--embed=cfijO',
    '--split-pages=1',
    '--page-filename=%d.page.html',
    '--bg-format=svg',
    '--optimize-text=1',
    `--dest-dir=${outputFolder}`,
    '--external-hint-tool=ttfautohint',
    '--turn-off-ligatures=1',
    'index.html',
  ]

  spawnSync('pdf2htmlEX', args, { stdio: 'inherit' })
}
