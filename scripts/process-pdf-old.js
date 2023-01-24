import path from 'path'
import fs from 'fs'
import urlJoin from 'url-join'
import commandLineArgs from 'command-line-args'
import os from 'os'
import { runPdf2htmlEXOld } from './run-pdf2htmlEX.js'
import getPdfMetadata from './get-pdf-metadata.js'
import findRoot from 'find-root'
import readline from 'readline'
import { modifyHtml } from './modify-html.js'
import { spawnSync } from 'child_process'

const siteConfigJson = fs.readFileSync('../src/site-config.json', 'utf8')
const siteConfig = JSON.parse(siteConfigJson)

const cliArgs = commandLineArgs([
  { name: 'file', defaultOption: true },
  { name: 'game', alias: 'g' },
  { name: 'designation', alias: 'd' },
  { name: 'rclone-remote-path' },
])

// Absolute path to the input file, i.e. '/home/user/pdfs/a-10c.pdf'
const pathToPdf = cliArgs.file.replace(/~/, os.homedir())
const metadata = await getPdfMetadata(pathToPdf)
// Absolute path to save the PDF output to, i.e. '/home/user/chucksguides.com/tmp/aircraft/dcs/a-10c/abcdefghijklmnop'
const outputFolder = path.join(findRoot(process.cwd()), 'tmp', metadata.outputPath)
console.log(`Saving output to folder: ${outputFolder}`)

if (fs.existsSync(outputFolder)) {
  process.stdout.write('Output folder already exists, deleting it...')
  fs.rmSync(outputFolder, { recursive: true })
  console.log('done.')
}

// Generate the HTML from the PDF.
runPdf2htmlEXOld(pathToPdf, outputFolder)

// ---------------------------------------------------------------------------------------------------------------------
const baseUrl = urlJoin(siteConfig.assetsBaseUrl, metadata.outputPath)
const pageFiles = fs.readdirSync(outputFolder).filter((file) => file.endsWith('.page.html'))
let currentPage = 1
pageFiles.forEach((file) => {
  readline.clearLine(process.stdout)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(`Modifying page ${currentPage}/${pageFiles.length}`)

  const pathToFile = path.join(outputFolder, file)
  modifyHtml(pathToFile, ($) => {
    const img = $('img')
    img.attr('src', urlJoin(baseUrl, img.attr('src')))
    img.attr('alt', null)
    img.attr('loading', 'lazy')
    img.attr('decoding', 'async')

    return $
  })

  currentPage = currentPage + 1
})

console.log() // Add newline.
// ---------------------------------------------------------------------------------------------------------------------
console.log(`Uploading guide files to ${cliArgs['rclone-remote-path']}...`)
const args = [
  'sync',
  outputFolder,
  `${cliArgs['rclone-remote-path']}/${metadata.outputPath}`,
  '-P',
  '--stats-one-line',
  '--transfers',
  '50',
]
spawnSync('rclone', args, { stdio: 'inherit' })
