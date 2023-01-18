import { spawnSync } from 'child_process'
import path from 'path'
import * as cheerio from 'cheerio'
import fs from 'fs'
import urlJoin from 'url-join'
import commandLineArgs from 'command-line-args'
import aircraftData from '../src/aircraft-data.json' assert { type: 'json' }
import md5File from 'md5-file'
import os from 'os'

const cliArgs = commandLineArgs([
  { name: 'file', defaultOption: true },
  { name: 'game', alias: 'g' },
  { name: 'designation', alias: 'd' },
])

// Absolute path to the input file, i.e. '/home/user/pdfs/a-10c.pdf'
const filePath = cliArgs.file.replace(/~/, os.homedir())
// Repo's root folder + /tmp, i.e. '/home/user/projects/chucksguides.com/tmp'
const tempFolder = path.join(path.dirname(process.cwd()), 'tmp')
// MD5 hash of the input file.
const md5hash = md5File.sync(filePath)
// Asset path of the aircraft, i.e. 'aircraft/dcs/a-10c'
const aircraftPath = aircraftData[cliArgs.game][cliArgs.designation]?.path
if (!aircraftPath) {
  console.error(`Aircraft path not found for game: ${cliArgs.game}, designation: ${cliArgs.designation}`)
  process.exit()
}

// Sub-folder to save the PDF output to, i.e. 'aircraft/dcs/a-10c/abcdefghijklmnop'
const basePath = path.join(aircraftPath, md5hash)
// Absolute path to save the PDF output to, i.e. '/home/user/aircraft/dcs/a-10c/abcdefghijklmnop'
const outputFolder = urlJoin(tempFolder, basePath)

const args = [
  filePath,
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
]

spawnSync('pdf2htmlEX', args, { stdio: 'inherit' })

// ---------------------------------------------------------------------------------------------------------------------

const baseUrl = urlJoin(aircraftData.metadata.assetsBaseUrl, basePath)
const pageFiles = fs.readdirSync(outputFolder).filter((file) => file.endsWith('.page.html'))
let currentPage = 1
pageFiles.forEach((file) => {
  process.stdout.clearLine(0)
  process.stdout.cursorTo(0)
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

// TODO: Replace guide.css woff URLs
// TODO: Upload assets using wrangler
// TODO: Upload PDF using wrangler, maybe?
// TODO: Update aircraft-data.json
