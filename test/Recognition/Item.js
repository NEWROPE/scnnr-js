import { expect } from 'chai'
import finishedRecognition from '../fixtures/finished_recognition.json'

import scnnr from '../../dist/scnnr.esm'

describe('Recognition.Item', () => {
  describe('constructor', () => {
    const object = finishedRecognition.objects[0]
    it('returns an instance of Recognition.Item', () => {
      const item = new scnnr.Recognition.Item(object)
      expect(item.category).to.equal(object.category)
      expect(item.boundingBox).to.equal(object.bounding_box)
      expect(item.labels).to.equal(object.labels)
    })
  })
})
