import path from 'path'
import fs from 'fs'
import urlJoin from 'url-join'
import commandLineArgs from 'command-line-args'
import runPdf2htmlEX from './run-pdf2htmlEX.js'
import getPdfMetadata from './get-pdf-metadata.js'
import findRoot from 'find-root'
import readline from 'readline'
import { modifyHtml } from './modify-html.js'
import { spawnSync } from 'child_process'
import { getCliCommandOutput } from './utils.js'
import prompts from 'prompts'

// Read the site config JSON.
const siteConfig = JSON.parse(fs.readFileSync('../src/site-config.json', 'utf8'))
// Set up command line arguments.
const cliArgs = commandLineArgs([
  { name: 'file', defaultOption: true },
  { name: 'game', alias: 'g' },
  { name: 'designation', alias: 'd' },
  { name: 'rclone-remote-path' },
])

// Get the absolute path to the PDF file.
const pathToPdf = getCliCommandOutput(`readlink -m '${cliArgs.file}'`)
// Get the metadata for the PDF, which gives us 
const metadata = await getPdfMetadata(pathToPdf, siteConfig)
// Absolute path to save the PDF output to, i.e. '/home/user/chucksguides.com/tmp/guides/dcs/a-10c/abcdefghijklmnop'
const outputFolder = path.join(findRoot(process.cwd()), 'tmp', 'guides', metadata.game, metadata.module, metadata.hash)
console.log(`Saving output to folder: ${outputFolder}`)

if (fs.existsSync(outputFolder)) {
  const { shouldReprocessPdf } = await prompts({
    type: 'select',
    name: 'shouldReprocessPdf',
    message: 'Output folder already exists, pick an action',
    choices: [
      { title: 'Use existing folder and skip PDF processing', value: false },
      { title: 'Delete folder and process PDF', value: true }
    ]
  })

  if (shouldReprocessPdf) {
    process.stdout.write('Deleting...')
    fs.rmSync(outputFolder, { recursive: true })
    console.log('done.')

    runPdf2htmlEX(pathToPdf, outputFolder)
  }
} else {
  runPdf2htmlEX(pathToPdf, outputFolder)
}

// ---------------------------------------------------------------------------------------------------------------------
const guideUrl = siteConfig.guideUrlTemplate
  .replace('{game}', metadata.game)
  .replace('{module}', metadata.module)
  .replace('{hash}', metadata.hash)

// Get all the *.page.html files and modify its HTML.
const pageFiles = fs.readdirSync(outputFolder).filter((file) => file.endsWith('.page.html'))
// Sort the pages by number rather than string, otherwise the "modifying page x/y" below will output the wrong numbers.
const sortedPageFiles = pageFiles.sort((a, b) => a.split('.')[0] - b.split('.')[0])

sortedPageFiles.forEach((filename) => {
  const pageNumber = filename.split('.')[0]

  readline.clearLine(process.stdout)
  readline.cursorTo(process.stdout, 0)
  process.stdout.write(`Modifying page ${pageNumber}/${pageFiles.length}`)

  const pathToFile = path.join(outputFolder, filename)
  modifyHtml(pathToFile, ($) => {
    // Change the background image src, make it lazy load and async decode, and remove the alt text.
    const img = $('img')
    img.attr('src', urlJoin(guideUrl, img.attr('src')))
    img.attr('alt', null)
    img.attr('loading', 'lazy')
    img.attr('decoding', 'async')
    
    $('a[href^="pf"]').each((index, anchor) => {
      const $anchor = $(anchor)
      const pageNumberInHex = $anchor.attr('href').split('pf')[1]
      const pageNumberInDec = parseInt(pageNumberInHex, 16)
      $anchor.attr('href', `#page${pageNumberInDec}`)
    })

    return $('.pc')
  })
})

// console.log() // Add newline.
// // ---------------------------------------------------------------------------------------------------------------------
// const outlineFilePath = path.join(outputFolder, 'outline.html')
// process.stdout.write('Modifying outline.html...')
// modifyHtml(outlineFilePath, ($) => {
//   $('a').each((index, anchor) => {
//     const $anchor = $(anchor)
//     const pageNumberInHex = $anchor.attr('href').split('pf')[1]
//     const pageNumberInDec = parseInt(pageNumberInHex, 16)
//     $anchor.attr('href', `#page${pageNumberInDec}`)
//     $anchor.attr('data-dest-detail', null)
//     $anchor.attr('class', null)
//   })

//   return $
// })
// console.log('done.')
// // ---------------------------------------------------------------------------------------------------------------------
// process.stdout.write('Modifying guide.css...')
// const guideCssFilePath = path.join(outputFolder, 'guide.css')
// let guideCss = fs.readFileSync(guideCssFilePath, 'utf8')
// guideCss = guideCss.replace(/(?<=url\()(\S+)(?=\.woff)/g, `${baseUrl}/$1`)
// fs.writeFileSync(guideCssFilePath, guideCss)
// console.log('done.')
// // ---------------------------------------------------------------------------------------------------------------------
// process.stdout.write('Deleting unnecessary files...')
// fs.rmSync(path.join(outputFolder, 'base.min.css'))
// fs.rmSync(path.join(outputFolder, 'compatibility.min.js'))
// fs.rmSync(path.join(outputFolder, 'guide.html'))
// fs.rmSync(path.join(outputFolder, 'fancy.min.css'))
// fs.rmSync(path.join(outputFolder, 'pdf2htmlEX.min.js'))
// fs.rmSync(path.join(outputFolder, 'pdf2htmlEX-64x64.png'))
// console.log('done.')
// // ---------------------------------------------------------------------------------------------------------------------
// console.log(`Uploading guide files to ${cliArgs['rclone-remote-path']}...`)
// const args = [
//   'sync',
//   outputFolder,
//   `${cliArgs['rclone-remote-path']}/${metadata.outputPath}`,
//   '-P',
//   '--stats-one-line',
//   '--transfers',
//   '50',
// ]
// spawnSync('rclone', args, { stdio: 'inherit' })
// // ---------------------------------------------------------------------------------------------------------------------
// console.log(`Uploading PDF to ${cliArgs['rclone-remote-path']}...`)
// const args2 = ['copy', pathToPdf, `${cliArgs['rclone-remote-path']}/pdf`, '-P']
// spawnSync('rclone', args2, { stdio: 'inherit' })
// // ---------------------------------------------------------------------------------------------------------------------
// const aircraftData = siteConfig.guides[metadata.game][metadata.designation]
// aircraftData.pageCount = metadata.pageCount
// aircraftData.assetsUrl = baseUrl
// aircraftData.pdfUrl = urlJoin(siteConfig.assetsBaseUrl, 'pdf', path.filename(pathToPdf))

// fs.writeFileSync(JSON.stringify(aircraftData, undefined, 2))
