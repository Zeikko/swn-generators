import { random } from 'lodash'

import { generateSection } from './section'

const maxRoomsPerSection = 8

export function generateDeck({ containerHeight, roomCount, labels }) {
  let sections = []

  let roomsLeft = roomCount
  while (roomsLeft > 0) {
    const sectionRoomCount = random(1, Math.min(roomsLeft, maxRoomsPerSection, Math.ceil(roomCount / 2)))
    roomsLeft = roomsLeft - sectionRoomCount
    const section = { containerHeight, roomCount: sectionRoomCount }
    sections = [...sections, section]
    
  }
  sections = groupLabels(sections, labels)
  let x = 10
  sections = sections.map(section => {
    const generatedSection = generateSection({ x, ...section })
    x = x + generatedSection.width
    return generatedSection
  })
  return { sections }
}

function groupLabels(sections, labels) {
  return sections.map(section => {
    const sectionLabels = labels.splice(0, section.roomCount)
    return { ...section, labels: sectionLabels }
  })
}