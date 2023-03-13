const pinataSDK = require("@pinata/sdk")
const path = require("path")
const fs = require("fs")
require("dotenv").config()

const PINATA_API_KEY = process.env.PINATA_API_KEY
const PINATA_API_SECRET = process.env.PINATA_API_SECRET
const pinata = new pinataSDK(PINATA_API_KEY, PINATA_API_SECRET)

const storeImages = async (imagesFilePath) => {
  const fullImagesPath = path.resolve(imagesFilePath)
  const files = fs.readdirSync(fullImagesPath)
  let responses = []
  console.log("Uploading to Pinata!")
  for (fileIndex in files) {
    console.log(`Working on ${fileIndex}...`)
    const readableStreamForFile = fs.createReadStream(`${fullImagesPath}/${files[fileIndex]}`)
    const options = {
      pinataMetadata: {
        name: files[fileIndex],
      },
    }
    try {
      const response = await pinata.pinFileToIPFS(readableStreamForFile, options)
      responses.push(response)
    } catch (err) {
      console.error(err)
    }
  }
  return { responses, files }
}

const storeTokenUrisMetadata = async (metadata) => {
  try {
    const response = await pinata.pinJSONToIPFS(metadata)
    return response
  } catch (err) {
    console.error(err)
  }
  return
}

module.exports = { storeImages, storeTokenUrisMetadata }
