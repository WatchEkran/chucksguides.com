import aircraftData from '../src/aircraft-data.json' assert { type: 'json' }
import path from 'path'
import lodash from 'lodash'
import md5File from 'md5-file'
import pdfinfo from 'pdfinfo'
import urlJoin from 'url-join'

const aircraftArray = []
Object.entries(aircraftData).forEach(([game, modules]) => {
  if (game === 'metadata') return

  Object.entries(modules).forEach(([designation, config]) => {
    config.game = game
    config.designation = designation
    aircraftArray.push(config)
  })
})

const lookupByPdfName = lodash.keyBy(aircraftArray, ({ pdfUrl }) => path.basename(pdfUrl))

export default async function getPdfMetadata(pathToPdf) {
  const pdf = pdfinfo(pathToPdf)
  const pdfMetadata = await new Promise((resolve) => {
    pdf.info((error, metadata) => {
      if (error) {
        console.error(`Could not get PDF info for ${pathToPdf}`)
        throw error
      }
      resolve(metadata)
    })
  })

  const filename = path.basename(pathToPdf)
  const aircraft = lookupByPdfName[filename]
  const md5 = md5File.sync(pathToPdf)
  const metadata = {
    outputPath: urlJoin(aircraft.path, md5),
    pages: pdfMetadata.pages,
  }

  if (aircraft) {
    console.log(`Found aircraft config in aircraft-data.json for filename '${filename}'`)
    console.log(metadata)
  } else {
    console.warn(`Could not find aircraft config in aircraft-data.json for filename '${filename}'`)
  }

  return metadata
}
