import path from 'path'
import fs from 'fs'
import urlJoin from 'url-join'
import commandLineArgs from 'command-line-args'
import { runPdf2htmlEXOld } from './run-pdf2htmlEX.js'
import getPdfMetadata from './get-pdf-metadata.js'
import findRoot from 'find-root'
import readline from 'readline'
import { modifyHtml } from './modify-html.js'
import { runCliCommand, getCliCommandOutput } from './utils.js'

const siteConfigJson = fs.readFileSync('../src/site-config-old.json', 'utf8')
const siteConfig = JSON.parse(siteConfigJson)

const cliArgs = commandLineArgs([
  { name: 'file', defaultOption: true },
  { name: 'game', alias: 'g' },
  { name: 'designation', alias: 'd' },
  { name: 'rclone-remote-path' },
])

// Absolute path to the input file, i.e. '/home/user/pdfs/a-10c.pdf'
const pathToPdf = getCliCommandOutput(`readlink -f ${cliArgs.file.replaceAll(' ', '\\ ')}`)
console.log('path to pdf', pathToPdf)
const metadata = await getPdfMetadata(pathToPdf, siteConfig)
const outputPath = urlJoin('aircraft', metadata.game, metadata.module, metadata.hash)
// Absolute path to save the PDF output to, i.e. '/home/user/chucksguides.com/tmp/aircraft/dcs/a-10c/abcdefghijklmnop'
const outputFolder = path.join(findRoot(process.cwd()), 'tmp', outputPath)
console.log(`Saving output to folder: ${outputFolder}`)

if (fs.existsSync(outputFolder)) {
  process.stdout.write('Output folder already exists, deleting it...')
  fs.rmSync(outputFolder, { recursive: true })
  console.log('done.')
}

// Generate the HTML from the PDF.
runPdf2htmlEXOld(pathToPdf, outputFolder)

// ---------------------------------------------------------------------------------------------------------------------
const baseUrl = urlJoin(siteConfig.assetsBaseUrl, outputPath)
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
console.log(`Uploading guide files to ${cliArgs['rclone-remote-path']}/${outputPath}...`)
const remoteFolder = `${cliArgs['rclone-remote-path']}/${outputPath}`
runCliCommand(`rclone sync ${outputFolder} ${remoteFolder} -P --stats-one-line --transfers 50`)
