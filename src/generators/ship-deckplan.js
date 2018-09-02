import * as d3 from 'd3'
import { random, last, shuffle, flatten, sum } from 'lodash'

const svgWidth = 1000
const svgHeight = 800
const svg = d3.select('svg')
let labels = []
const corridorHeight = 5 * 10

export function generateDeckplan(hullType, fittings) {  
  svg.selectAll("*").remove()
  getLabels(fittings)
  const sections = createSections(hullType)
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

function createSections(hullType) {
  let roomsLeft = hullType.maxRooms
  let sections = []
  let x = 10
  let sectionNumber = 1
  let corridorLength = random(0, roomsLeft / 2)
  while(roomsLeft > 0) {
    const width = random(10, 20) * 10
    const maxRoomsOnThisSection = Math.min(3, hullType.maxRooms, sectionNumber)
    let roomCount = random(1, maxRoomsOnThisSection)
    if (corridorLength > 0) {
      roomCount = random(Math.min(2, maxRoomsOnThisSection), Math.min(2, maxRoomsOnThisSection))
    }
    roomsLeft -= roomCount
    sections = [...sections, { x, width, roomCount, corridorLength }]
    x += width
    sectionNumber += 1
    corridorLength -= 1
  }
  return sections
}

function createRooms(sections) {
  const corridor = createCorridor(sections)
  const rooms = sections.map((section) => {
    const { roomCount, width, x, corridorLength } = section
    if (roomCount === 1) {
      return createCenterRoom(x, width)
    }
    if (corridorLength > 0) {
      return createMainCorridorRooms(x, width, roomCount)
    }
    if (roomCount === 2) {
      return createDoubleRooms(x, width)
    }
    if (roomCount === 3) {
      return createTripleRooms(x, width)
    }
  })
  return corridor ? [corridor, ...rooms] : rooms
}

function createCenterRoom(x, width) {
  const height = random(10, 30) * 10
  const y = (svgHeight - height) / 2
  return [{ width, height, x, y, label: labels.pop() }]
}

function createDoubleRooms(x, width) {
  const height = random(10, 20) * 10
  const firstY = svgHeight / 2 - height
  const secondY = svgHeight / 2
  return [
    { width, height, x, y: firstY, label: labels.pop() },
    { width, height, x, y: secondY, label: labels.pop() }
  ]
}

function createTripleRooms(x, width) {
  const centerHeight = random(10, 20) * 10
  const sideHeight = random(10, 20) * 10
  const firstY = (svgHeight - centerHeight) / 2
  const secondY = (svgHeight - centerHeight) / 2 - sideHeight
  const thirdY = (svgHeight - centerHeight) / 2 + centerHeight
  return [
    { width, height: centerHeight, x, y: firstY, label: labels.pop() },
    { width, height: sideHeight, x, y: secondY, label: labels.pop() },
    { width, height: sideHeight, x, y: thirdY, label: labels.pop() }
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
  const corridorSections = sections.filter(section => section.corridorLength > 0 && section.roomCount > 1)
  if(corridorSections.length === 0) {
    return
  }
  const x = corridorSections[0].x
  const y = (svgHeight - corridorHeight) / 2
  const width = sum(corridorSections.map(section => section.width))
  const height = corridorHeight
  return { width, height, x, y, label: 'Corridor' }
}