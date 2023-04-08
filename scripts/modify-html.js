import * as cheerio from 'cheerio'
import fs from 'fs'
import pretty from 'pretty'

export function modifyHtml(pathToFile, modifyFn) {
  // Load the HTML string as a fragment so that the html/head/body tags are not added.
  const $ = cheerio.load(fs.readFileSync(pathToFile), null, false)
  const output = modifyFn($)
  // Pretty output the HTML for easier viewing. The CDN will transparently minify it.
  const prettyOutput = pretty(output.html())
  fs.writeFileSync(pathToFile, prettyOutput)
}
