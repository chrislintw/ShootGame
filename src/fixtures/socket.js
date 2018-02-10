import { simpleID } from '../utils/random'
import faker from 'faker'
import _ from 'lodash'

export function generatePlayerData () {
  const data = {
    id: simpleID(),
    color: faker.commerce.color(),
    name: faker.name.findName(),
    x: _.random(-200, 200),
    y: _.random(-200, 200)
  }

  return data
}
