import * as d3 from 'd3'
import { random, last, shuffle, flatten, sum } from 'lodash'

const svgWidth = 1000
const svgHeight = 800
const svg = d3.select('svg')
let labels = []
const corridorHeight = 5 * 10

const patterns = [
  'Rectangle',
  'Triangle',
  'Random',
]

export function generateDeckplan(hullType, fittings) {  
  svg.selectAll("*").remove()
  getLabels(fittings)
  const pattern = patterns[random(0, patterns.length - 1)]
  const sections = createSections(pattern, hullType)
  const rooms = createRooms(sections)
  flatten(rooms).forEach(room => {
    svg.append('rect')
      .attr('width', room.width)
      .attr('height', room.height)
      .attr('x', room.x)
      .attr('y', room.y)
      .attr('fill', 'white')
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
    svg.append('text')
      .attr('x', room.x + room.width / 2)
      .attr('y', room.y + room.height / 2)
      .attr('text-anchor', 'middle')
      .text(room.label)
    })
}

const commonLabels = [
  'Bridge',
  'Crew Quarters',
  'Engineering',
  'Storage',
  'Reactor',
  'Engine Room',
]

function getLabels(fittings) {
  const fittingLabels = fittings
    .filter(fitting => fitting.room)
    .map(fitting => fitting.value)
  labels = shuffle([...commonLabels, ...fittingLabels])
}

function createBridge() {
  const width = random(10, 20) * 10
  const height = random(10, 20) * 10
  const x = 10
  const y = (svgHeight - height) / 2
  return { width, height, x, y, label: 'Bridge' }
}

function createSections(pattern, hullType) {
  let roomsLeft = hullType.maxRooms
  let sections = []
  let x = 10
  let sectionNumber = 1
  let corridorLength = calculateCorridorLength(pattern, hullType.maxRooms)
  while(roomsLeft > 0) {
    const width = random(10, 20) * 10
    const roomCount = calculateSectionRoomCount(pattern, hullType.maxRooms, sectionNumber, roomsLeft)
    roomsLeft -= roomCount
    sections = [...sections, { x, width, roomCount, corridorLength }]
    x += width
    sectionNumber += 1
    corridorLength -= 1
  }
  return sections
}

function calculateCorridorLength(pattern, maxRooms) {
  switch (pattern) {
    case 'Rectangle':
      return random(0, Math.floor(maxRooms / 3))
    case 'Triangle':
      return random(0, 2)
    case 'Random':
      return random(0,Math.floor(maxRooms / 2))
  }
}

function calculateSectionRoomCount(pattern, maxRooms, sectionNumber, roomsLeft) {
  switch (pattern) {
    case 'Rectangle':
      return Math.max(1, Math.floor(Math.sqrt(maxRooms)))
    case 'Triangle':
      return sectionNumber
    case 'Random':
      return Math.max(1, random(1, Math.floor(maxRooms / 3)))
  }
}

function createRooms(sections) {
  const corridor = createCorridor(sections)
  const rooms = sections.map((section) => {
    const { roomCount, width, x, corridorLength } = section
    if (roomCount === 1) {
      return createOneRoom(x, width)
    }
    if (roomCount % 2 === 1) {
      return createOddRooms(x, width, roomCount)
    }
    if (corridorLength > 0) {
      return createMainCorridorRooms(x, width, roomCount)
    }
    if (roomCount % 2 === 0) {
      return createEvenRooms(x, width, roomCount)
    }
  })
  return corridor ? [corridor, ...rooms] : rooms
}

function createOneRoom(x, width) {
  const height = random(10, 30) * 10
  const y = (svgHeight - height) / 2
  return [{ width, height, x, y, label: labels.pop() }]
}

function createEvenRooms(x, width, roomCount) {
  const height = random(10, 20) * 10
  let rooms = []
  for (let i = 1; i * 2 <= roomCount; i ++) {
    const upperY = svgHeight / 2 - height * i
    const lowerY = svgHeight / 2 + (height * (i - 1))
    rooms = [
      ...rooms,
      { width, height, x, y: upperY, label: labels.pop() },
      { width, height, x, y: lowerY, label: labels.pop() },
    ]
  }
  return rooms
}

function createOddRooms(x, width, roomCount) {
  const centerHeight = random(10, 20) * 10
  const sideHeight = random(10, 20) * 10
  const centerY = (svgHeight - centerHeight) / 2
  let rooms = [{ width, height: centerHeight, x, y: centerY, label: labels.pop() }]
  for (let i = 1; i * 2 <= roomCount; i ++) {
    const upperY = (svgHeight - centerHeight) / 2 - (sideHeight * i)
    const lowerY = (svgHeight - centerHeight) / 2 + centerHeight + (sideHeight * (i - 1))
    rooms = [
      ...rooms,
    { width, height: sideHeight, x, y: upperY, label: labels.pop() },
    { width, height: sideHeight, x, y: lowerY, label: labels.pop() }
    ]
  }
  return rooms
  return [

  ]
}

function createMainCorridorRooms(x, width) {
  const sideHeight = random(10, 20) * 10
  const firstY = (svgHeight - corridorHeight) / 2
  const secondY = (svgHeight - corridorHeight) / 2 - sideHeight
  const thirdY = (svgHeight - corridorHeight) / 2 + corridorHeight
  return [
    { width, height: sideHeight, x, y: secondY, label: labels.pop() },
    { width, height: sideHeight, x, y: thirdY, label: labels.pop() }
  ]
}

function createCorridor(sections) {
  let corridorSections = []
  let corridorNotEnded = true
  sections.forEach(section => {
    corridorNotEnded = section.corridorLength > 0 && section.roomCount % 2 === 0
    if (corridorNotEnded) {
      corridorSections = [...corridorSections, section]
    }
  })
  if(corridorSections.length === 0) {
    return
  }
  const x = corridorSections[0].x
  const y = (svgHeight - corridorHeight) / 2
  const width = sum(corridorSections.map(section => section.width))
  const height = corridorHeight
  return { width, height, x, y, label: 'Corridor' }
}