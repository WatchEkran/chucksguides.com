import path from 'path'
import * as cheerio from 'cheerio'
import fs from 'fs'
import urlJoin from 'url-join'
import commandLineArgs from 'command-line-args'
import aircraftData from '../src/aircraft-data.json' assert { type: 'json' }
import os from 'os'
import runPdf2htmlEX from './run-pdf2htmlEX.js'
import getPdfMetadata from './get-pdf-metadata.js'
import findRoot from 'find-root'
import readline from 'readline'

const cliArgs = commandLineArgs([
  { name: 'file', defaultOption: true },
  { name: 'game', alias: 'g' },
  { name: 'designation', alias: 'd' },
])

// Absolute path to the input file, i.e. '/home/user/pdfs/a-10c.pdf'
const pathToPdf = cliArgs.file.replace(/~/, os.homedir())
const metadata = await getPdfMetadata(pathToPdf)
// Absolute path to save the PDF output to, i.e. '/home/user/chucksguides.com/tmp/aircraft/dcs/a-10c/abcdefghijklmnop'
const outputFolder = path.join(findRoot(process.cwd()), 'tmp', metadata.outputPath)
console.log(`Saving output to folder: ${outputFolder}`)

// Generate the HTML from the PDF.
runPdf2htmlEX(pathToPdf, outputFolder)

// ---------------------------------------------------------------------------------------------------------------------

const baseUrl = urlJoin(aircraftData.metadata.assetsBaseUrl, metadata.outputPath)
const pageFiles = fs.readdirSync(outputFolder).filter((file) => file.endsWith('.page.html'))
let currentPage = 1
pageFiles.forEach((file) => {
  readline.clearLine(process.stdout)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(`Modifying page ${currentPage}/${pageFiles.length}`)

  const filePath = path.join(outputFolder, file)
  const $ = cheerio.load(fs.readFileSync(filePath))
  const img = $('img')
  img.attr('src', urlJoin(baseUrl, img.attr('src')))
  img.attr('loading', 'lazy')
  img.attr('decoding', 'async')

  const outputHtml = $('.pc').toString()
  fs.writeFileSync(filePath, outputHtml)
  currentPage = currentPage + 1
})

console.log('\n')

// ---------------------------------------------------------------------------------------------------------------------

// TODO: Modify outline.html to change the page numbering from hex to dec
// TODO: Replace guide.css woff URLs
// TODO: Upload assets using wrangler
// TODO: Upload PDF using wrangler, maybe?
// TODO: Update aircraft-data.json
