import * as d3 from 'd3'
import { random, last, shuffle, flatten, sum, get, orderBy } from 'lodash'
import { generateDeck } from './deck'

const svgWidth = 1000
const containerHeight = 800
const svg = d3.select('svg')
const corridorHeight = 5 * 10

const patterns = [
  'Rectangle',
  'Triangle',
  'Random',
]

export function generateDeckplan(hullType, fittings) { 
  svg.selectAll('*').remove()
  const deck = generateDeck({ containerHeight, roomCount: hullType.maxRooms, fittings })
  renderSections(svg, deck.sections)
}

function renderSections(svg, sections) {
  sections.forEach(section => {
    svg.append('rect')
      .attr('width', section.width)
      .attr('height', section.height)
      .attr('x', section.x)
      .attr('y', section.y)
      .attr('stroke', '#666')
      .attr('fill', 'white')
      .attr('stroke-width', 5)
    renderRooms(svg, section.rooms)
  })
}

function renderRooms(svg, rooms) {
  rooms.forEach(room => {
    svg.append('rect')
      .attr('width', room.width)
      .attr('height', room.height)
      .attr('x', room.x)
      .attr('y', room.y)
      .attr('stroke', '#666')
      .attr('fill', '#EEE')
      .attr('stroke-width', 3)
  })
}

/*
export function generateDeckplan(hullType, fittings) {  
  svg.selectAll('*').remove()
  getLabels(fittings)
  const pattern = patterns[random(0, patterns.length - 1)]
  const sections = createSections(pattern, hullType)
  let rooms = createRooms(sections)
  rooms = flatten(rooms)
  rooms = labelRooms(sections, rooms, fittings)
  rooms = rooms.filter(room => room.width !== undefined)
  rooms.forEach(room => {
    svg.append('rect')
      .attr('width', room.width)
      .attr('height', room.height)
      .attr('x', room.x)
      .attr('y', room.y)
      .attr('fill', '#EEE')
      .attr('stroke', '#666')
      .attr('stroke-width', 5)
    svg.append('text')
      .attr('x', room.x + room.width / 2)
      .attr('y', room.y + room.height / 2)
      .attr('text-anchor', 'middle')
      .text(get(room, 'label.value'))
    })
}

function createSections(pattern, hullType) {
  let roomsLeft = hullType.maxRooms
  let sections = []
  let x = 10
  let sectionNumber = 1
  let corridorCount = null
  while(roomsLeft > 0) {
    const lengthY = calculateSectionRoomCount(pattern, hullType.maxRooms, sectionNumber, roomsLeft)
    const lengthX = Math.min(random(1, Math.min(Math.ceil(roomsLeft / lengthY), 3)), roomsLeft)
    const roomCount = random(Math.min(lengthY, lengthX), lengthY * lengthX)
    const sectionWidth = random(10, 20) * 10 * lengthX
    roomsLeft -= lengthY * lengthX
    corridorCount = calculateCorridorCount({ previousCorridorCount: corridorCount, lengthY })
    sections = [...sections, { x, sectionWidth, lengthY, corridorCount, sectionNumber, lengthX, roomCount }]
    x += sectionWidth
    sectionNumber += 1
  }
  return sections
}

function calculateCorridorCount({ previousCorridorCount, lengthY }) {
  if (lengthY % 2 === 0) {
    if (previousCorridorCount & 2 === 1) {
      if (random(1,4) > 1) {
        return previousCorridorCount
      }
    } else {
      return random(0, 1)
    }
  } else {
    return 0
  }

}

function calculateSectionRoomCount(pattern, maxRooms, sectionNumber, roomsLeft) {
  switch (pattern) {
    case 'Rectangle':
      return Math.max(1, Math.floor(Math.sqrt(maxRooms)))
    case 'Triangle':
      return Math.min(sectionNumber, roomsLeft)
    case 'Random':
      return Math.max(1, random(1, Math.floor(maxRooms / 3)))
  }
}

function createRooms(sections) {
  console.log('sections', sections)
  const corridors = createCorridors(sections)
  let rooms = sections.map((section, i) => {
    const isLastSection = i === sections.length - 1
    const { lengthY, corridorCount } = section
    const corridorHeight = corridorCount > 0 ? 50 : 0
    console.log('section', section)
    return createRoom({ ...section, isLastSection, corridorHeight })
  })
  rooms = flatten(rooms)
  console.log('rooms', rooms)
  console.log('corridors', corridors)
  return [...rooms, ...corridors]
}

function createRoom({ x: sectionX, sectionWidth, lengthY, sectionNumber, corridorHeight, isLastSection, lengthX, roomCount }) {
  console.log(sectionX, sectionWidth, lengthY, sectionNumber, corridorHeight, isLastSection, lengthX, roomCount)
  let heights = []
  for (let i; i <= lengthY; i++) {
    heights = [...heights, random(10, 20) * 10]
  }
  let widths = (let i; i <= lengthY; i++) {
    widths = [...widths, random(10, 20) * 10 : sectionWidth
  }
  width = width / lengthX
  let rooms = []
  let roomsLeft = roomCount
  for (let roomY = 1; roomY <= lengthY; roomY++) {
    const roomCountY = random(1, Math.ceil(roomsLeft / lengthX))
    for (let roomX = 1; roomX <= lengthX; roomX++) {
      const x = sectionX + width * (roomX - 1)
      const y = (svgHeight - corridorHeight) / 2 - height * roomY
      rooms = [
        ...rooms,
        { width, height, x, y, sectionNumber, distanceToCenter: roomY },
      ]
    }
  }
  return rooms
}

function createOddRooms({ x, sectionWidth, lengthY, sectionNumber, isLastSection, lengthX }) {
  const sideHeight = random(10, 20) * 10
  let centerWidth = isLastSection ? random(10, 20) * 10 : sectionWidth
  centerWidth = centerWidth / lengthX
  const centerHeight = random(10, 20) * 10
  const centerY = (svgHeight - centerHeight) / 2
  let rooms = [{ width: centerWidth, height: centerHeight, x, y: centerY, sectionNumber, distanceToCenter: 0 }]
  for (let i = 1; i * 2 <= lengthY; i ++) {
    const sideWidth = isLastSection ? random(10, 20) * 10 : sectionWidth
    const upperY = (svgHeight - centerHeight) / 2 - (sideHeight * i)
    const lowerY = (svgHeight - centerHeight) / 2 + centerHeight + (sideHeight * (i - 1))
    const sideX = getX(x, sectionWidth, sideWidth, isLastSection, lengthX)
    rooms = [
      ...rooms,
    { width: sideWidth, height: sideHeight, x: x, y: upperY, sectionNumber, distanceToCenter: i - 1 },
    { width: sideWidth, height: sideHeight, x: x, y: lowerY, sectionNumber, distanceToCenter: i - 1 }
    ]
  }
  return rooms
}

function getX(x, sectionWidth, width, isLastSection, lengthX) {
  if (lengthX === 1) {
    return x
  } else {
    const difference = sectionWidth * lengthX - width
    const align = random(1,3)
    if (align === 1 || isLastSection) {
      return x
    } else if (align === 2) {
      return x + difference / 2
    } else if (align === 3) {
      return x + difference
    }
  }
}

function createCorridors(sections) {
  const height = 50
  const y = (svgHeight - corridorHeight) / 2
  let corridors = []
  let previousCorridorCount = null
  let width = 0
  let x = sections[0].x
  sections.forEach(section => {
    if (section.corridorCount !== previousCorridorCount) {
      x = section.x
    }
    if (section.corridorCount === 0) {
      width = 0
    } else {
      width = width + section.sectionWidth
    }
    if (section.corridorCount > 0) {
      corridors = [...corridors, { width, height, x, y, label: { value: 'Corridor' } }]
    }
    previousCorridorCount = section.corridorCount
  })
  return corridors
}

function labelRooms(sections, rooms, fittings) {
  const alreadyLabeledRooms = rooms.filter(room => room.label !== undefined)
  const labels = getLabels(fittings)
  const roomsToLabel = rooms.map((room, id) => ({ ...room, id }))
  let labeledRoomsIds = []
  const labeledRooms = labels.map(label => {
    const unlabeledRooms = roomsToLabel.filter(room => room.label === undefined && !labeledRoomsIds.includes(room.id))
    const scoredRooms = scoreRooms(sections, unlabeledRooms, label)
    const orderedRooms = orderBy(scoredRooms, ['score'], ['desc'])
    const room = { ...orderedRooms[0], label }
    labeledRoomsIds = [ ...labeledRoomsIds, room.id ]
    return room
  })
  return [ ...alreadyLabeledRooms, ...labeledRooms ]
}

function scoreRooms(sections, rooms, label) {
  return rooms.map(room => {
    const frontScore = 1 - (room.sectionNumber - 1) / (sections.length -1) * label.front
    return { ...room, score: frontScore * random(0.1,1) }
  })
}

const necessaryLabels = [
  { value: 'Bridge',        front: 1,    center: 0.8, size: 0.5 },
  { value: 'Crew Quarters', front: 0.5,  center: 0,   size: 1 },
  { value: 'Engine Room',   front: -1,   center: 1,   size: 1 },
]

const bonusLabels = [
  { value: 'Reactor',       front: -0.5, center: 1,   size: 1 },
  { value: 'Storage',       front: 0,    center: 0,   size: 0.5 },
  { value: 'Engineering',   front: 0,    center: 0,   size: 1 },
  { value: 'Crew Quarters', front: 0.5,  center: 0,   size: 1 },
  { value: 'Life Support',   front: 0,    center: 0,   size: 1 },
]

function getLabels(fittings) {
  const fittingLabels = fittings
    .filter(fitting => fitting.room)
    .map(fitting => ({
      value: fitting.value
    }))
  return [...necessaryLabels, ...fittingLabels, ...bonusLabels ]
}
*/