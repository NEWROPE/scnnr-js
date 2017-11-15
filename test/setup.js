import nock from 'nock'

require('chai').should()

nock.disableNetConnect()
beforeEach(() => { nock.cleanAll() })
