import { random } from 'lodash'

import { generateSection } from './section'

const maxRoomsPerSection = 4

export function generateDeck({ containerHeight, roomCount, fittings }) {
  console.log('roomCount', roomCount)
  let sections = []
  let x = 10
  let roomsLeft = roomCount
  while (roomsLeft > 0) {
    const sectionRoomCount = random(1, Math.min(roomsLeft, maxRoomsPerSection))
    roomsLeft = roomsLeft - sectionRoomCount
    const section = generateSection({ containerHeight, x, roomCount: sectionRoomCount })
    sections = [...sections, section]
    x = x + section.width
  }
  console.log('sections', sections)
  return { sections }
}