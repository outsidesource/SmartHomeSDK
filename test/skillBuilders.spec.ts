import { expect } from 'chai'
import 'mocha'
import { SkillBuilders } from '../src/skill/SkillBuilders'

describe('skill builders', function () {
  it('returns a SmartHomeSkillBuilder', function () {
    const builder = SkillBuilders.smarthome()

    expect(builder).to.not.be.undefined
    expect(builder).to.not.be.null
  })
})
