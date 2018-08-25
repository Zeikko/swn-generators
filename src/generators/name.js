import { random } from 'lodash'
import shipNameData from '../constants/ship-names.json'

export function generateShipName() {
  return `${getShipNamePart()} ${getShipNamePart()}`
}

function getShipNamePart() {
  return shipNames[random(0, shipNames.length -1)].split(' ').pop()
}

function filterWikiDataIds(data, labelName) {
  return data
    .map(item => item[labelName])
    .filter(item => !item.match(/Q[0-9]+$/))
}

const shipNames = filterWikiDataIds(shipNameData, 'shipLabel')
