import { expect } from 'chai'
import finishedRecognition from './fixtures/finished_recognition.json'

import scnnr from '../dist/scnnr.esm'

describe('Recognition', () => {
  describe('constructor', () => {
    it('returns an instance of Recognition', () => {
      const recognition = new scnnr.Recognition(finishedRecognition)
      expect(recognition.id).to.equal(finishedRecognition.id)
      expect(recognition.objects.length).to.equal(finishedRecognition.objects.length)
      expect(recognition.objects[0]).to.be.an.instanceof(scnnr.Recognition.Item)
      expect(recognition.state).to.equal(recognition.state)
      expect(recognition.image).to.be.undefined
      expect(recognition.error).to.be.undefined
    })

    it('should parse an image field', () => {
      const image = { url: 'https://example.com/dummy.jpg', size: { width: 300, height: 400 } }
      const recognition = new scnnr.Recognition(Object.assign({}, finishedRecognition, { image }))
      expect(recognition.image).to.be.an.instanceof(scnnr.Recognition.Image)
      expect(recognition.image.url).to.equal(image.url)
      expect(recognition.image.size).to.be.an.instanceof(scnnr.Recognition.Image.Size)
      expect(recognition.image.size.width).to.equal(image.size.width)
      expect(recognition.image.size.height).to.equal(image.size.height)
    })
  })
})
