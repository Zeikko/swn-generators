import { random } from 'lodash'
import shipNameData from '../constants/ship-names.json'

export function generateShipName() {
  const pieces = random(1,3)
  let name = []
  for (let i = 0; i < pieces; i++) {
    name = [ ...name, getShipNamePart() ]
  }
  return name.join(' ')
}

function getShipNamePart() {
  return shipNames[random(0, shipNames.length -1)]
}

function filterWikiDataIds(data, labelName) {
  return data
    .map(item => item[labelName].split(' ').pop())
    .filter(item => !item.match(/[0-9]+\)$/))
    .filter(item => !item.match(/Q[0-9]+$/))
}

const shipNames = filterWikiDataIds(shipNameData, 'shipLabel')
