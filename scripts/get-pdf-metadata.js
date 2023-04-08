import path from 'path'
import lodash from 'lodash'
import md5File from 'md5-file'
import pdfinfo from 'pdfinfo'

export default async function getPdfMetadata(pathToPdf, siteConfig) {
  const aircraftArray = []
  Object.entries(siteConfig.guides).forEach(([game, modules]) => {
    Object.entries(modules).forEach(([module, config]) => {
      config.game = game
      config.module = module
      aircraftArray.push(config)
    })
  })

  const lookupByPdfName = lodash.keyBy(aircraftArray, 'pdfFilename')

  const pdf = pdfinfo(pathToPdf)
  // Get info about the PDF.
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
  const aircraftData = lookupByPdfName[filename]
  const hash = md5File.sync(pathToPdf)
  const metadata = {
    game: aircraftData.game,
    module: aircraftData.module,
    hash,
    pageCount: pdfMetadata.pages,
  }

  if (aircraftData) {
    console.log(`Found aircraft config for filename '${filename}'`)
    console.log(metadata)
  } else {
    console.warn(`Could not find aircraft config for filename '${filename}'`)
  }

  return metadata
}
