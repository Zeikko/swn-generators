import { random } from 'lodash'

import { generateSection } from './section'

const maxRoomsPerSection = 6

export function generateDeck({ containerHeight, roomCount, fittings }) {
  let sections = []
  let x = 10
  let roomsLeft = roomCount
  while (roomsLeft > 0) {
    const sectionRoomCount = random(1, Math.min(roomsLeft, maxRoomsPerSection, Math.ceil(roomCount / 2)))
    roomsLeft = roomsLeft - sectionRoomCount
    const section = generateSection({ containerHeight, x, roomCount: sectionRoomCount })
    sections = [...sections, section]
    x = x + section.width
  }
  console.log('sections', sections)
  return { sections }
}