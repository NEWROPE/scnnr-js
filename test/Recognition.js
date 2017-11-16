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
      expect(recognition.error).to.be.undefined
    })
  })
})
