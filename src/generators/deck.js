import { random, flatten } from 'lodash'

import { generateSection } from './section'
import { generateVerticalCorridor } from './vertical-corridor'

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
  sections = sections.map((section, i) => {
    const isFirstSection = i === 0
    const isLastSection = i === sections.length - 1
    const generatedSection = generateSection({ x, ...section, isFirstSection, isLastSection })
    let generatedVerticalCorridor = null
    x = x + generatedSection.width
    if (!isLastSection && random(0,2) === 0) {
      generatedVerticalCorridor = generateVerticalCorridor({
        x,
        y: generatedSection.y,
        height: generatedSection.height,
        roomCount: 1,
        containerHeight
      })
      x = x + generatedVerticalCorridor.width
    }
    return generatedVerticalCorridor ? [generatedSection, generatedVerticalCorridor] : generatedSection
  })
  sections = flatten(sections)
  return { sections }
}

function groupLabels(sections, labels) {
  return sections.map(section => {
    const sectionLabels = labels.splice(0, section.roomCount)
    return { ...section, labels: sectionLabels }
  })
}
