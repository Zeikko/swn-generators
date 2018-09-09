import * as d3 from 'd3'
import { random, last, shuffle, flatten, sum, get, orderBy } from 'lodash'

const svgWidth = 1000
const svgHeight = 800
const svg = d3.select('svg')
const corridorHeight = 5 * 10

const patterns = [
  'Rectangle',
  'Triangle',
  'Random',
]

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
    const width = random(10, 20) * 10
    const roomCount = calculateSectionRoomCount(pattern, hullType.maxRooms, sectionNumber, roomsLeft)
    const widthMultiplier = Math.min(random(1, random(1,2)), roomCount)
    roomsLeft -= roomCount
    corridorCount = calculateCorridorCount({ previousCorridorCount: corridorCount, roomCount })
    sections = [...sections, { x, width, roomCount, corridorCount, sectionNumber, widthMultiplier }]
    x += width * widthMultiplier
    sectionNumber += 1
  }
  return sections
}

function calculateCorridorCount({ previousCorridorCount, roomCount }) {
  if (roomCount % 2 === 1) {
    return 0
  }
  if (previousCorridorCount) {
    if (random(1,4) > 1) {
      return previousCorridorCount
    }
  } else {
    return random(0, 1)
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
  const corridors = createCorridors(sections)
  let rooms = sections.map((section, i) => {
    const isLastRoom = i === sections.length - 1
    const { roomCount, width: sectionWidth, x, corridorLength, sectionNumber, widthMultiplier, corridorCount } = section
    if (roomCount === 1) {
      return createOneRoom({ x, sectionWidth, sectionNumber, widthMultiplier })
    }
    if (roomCount % 2 === 1) {
      return createOddRooms({ x, sectionWidth, roomCount, sectionNumber, isLastRoom, widthMultiplier })
    }
    if (roomCount % 2 === 0) {
      const corridorHeight = corridorCount > 0 ? 50 : 0
      return createEvenRooms({ x, sectionWidth, roomCount, sectionNumber, corridorHeight, isLastRoom, widthMultiplier })
    }
  })
  return [...rooms, ...corridors]
}

function createOneRoom({ x, sectionWidth, sectionNumber, widthMultiplier }) {
  const width = sectionWidth * widthMultiplier
  const height = random(10, 40) * 10
  const y = (svgHeight - height) / 2
  return [{ width, height, x, y, sectionNumber, distanceToCenter: 0 }]
}

function createEvenRooms({ x, sectionWidth, roomCount, sectionNumber, corridorHeight, isLastRoom, widthMultiplier }) {
  const height = random(10, 20) * 10
  let rooms = []
  for (let i = 1; i * 2 <= roomCount; i ++) {
    let width = isLastRoom ? random(10, 20) * 10 : sectionWidth
    if (i > i) {
      width = width * random(1, widthMultiplier)
    } else {
      width = width * widthMultiplier
    }
    const upperY = (svgHeight - corridorHeight) / 2 - height * i
    const lowerY = (svgHeight - corridorHeight) / 2 + (height * (i - 1)) + corridorHeight
    rooms = [
      ...rooms,
      { width, height, x, y: upperY, sectionNumber, distanceToCenter: i },
      { width, height, x, y: lowerY, sectionNumber, distanceToCenter: i },
    ]
  }
  return rooms
}

function createOddRooms({ x, sectionWidth, roomCount, sectionNumber, isLastRoom, widthMultiplier }) {
  const sideHeight = random(10, 20) * 10
  let centerWidth = isLastRoom ? random(10, 20) * 10 : sectionWidth
  centerWidth = centerWidth * widthMultiplier
  const centerHeight = random(10, 20) * 10
  const centerY = (svgHeight - centerHeight) / 2
  let rooms = [{ width: centerWidth, height: centerHeight, x, y: centerY, sectionNumber, distanceToCenter: 0 }]
  for (let i = 1; i * 2 <= roomCount; i ++) {
    const sideWidth = isLastRoom ? random(10, 20) * 10 : sectionWidth
    const upperY = (svgHeight - centerHeight) / 2 - (sideHeight * i)
    const lowerY = (svgHeight - centerHeight) / 2 + centerHeight + (sideHeight * (i - 1))
    const sideX = getX(x, sectionWidth, sideWidth, isLastRoom, widthMultiplier)
    rooms = [
      ...rooms,
    { width: sideWidth, height: sideHeight, x: sideX, y: upperY, sectionNumber, distanceToCenter: i - 1 },
    { width: sideWidth, height: sideHeight, x: sideX, y: lowerY, sectionNumber, distanceToCenter: i - 1 }
    ]
  }
  return rooms
}

function getX(x, sectionWidth, width, isLastRoom, widthMultiplier) {
  if (widthMultiplier === 1) {
    return x
  } else {
    const difference = sectionWidth * widthMultiplier - width
    const align = random(1,3)
    if (align === 1 || isLastRoom) {
      return x
    } else if (align === 2) {
      return x + difference / 2
    } else if (align === 3) {
      return x + difference
    }
  }
}

function createCorridors(sections) {
  console.log(sections)
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
    if (section.corridorCount > 0) {
      width = width + section.width * section.widthMultiplier
    }
    console.log(width)
    if (section.corridorCount > 0) {
      corridors = [...corridors, { width, height, x, y, label: { value: 'Corridor' } }]
    }
    previousCorridorCount = section.corridorCount
  })
  console.log(corridors)
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