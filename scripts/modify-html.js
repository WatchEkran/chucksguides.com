import * as cheerio from 'cheerio'
import fs from 'fs'

export function modifyHtml(pathToFile, modifyFn) {
  // Load the HTML string as a fragment so that the html/head/body tags are not added.
  const $ = cheerio.load(fs.readFileSync(pathToFile), null, false)
  const output = modifyFn($)
  fs.writeFileSync(pathToFile, output.html())
}
