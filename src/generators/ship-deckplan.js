import * as d3 from 'd3'
import { random, last, shuffle } from 'lodash'

const svgWidth = 1000
const svgHeight = 800
const svg = d3.select('svg')
let rooms = []

export function generateDeckplan(hullType, fittings) {  
  svg.selectAll("*").remove()
  rooms = [createBridge()]
  for(let i = 1; i <= 5; i++) {
    rooms = [...rooms, ...createSection(hullType)]
    if (rooms.length > hullType.maxRooms) {
      break;
    }
  }
  rooms = labelRooms(rooms, fittings)
  rooms.forEach(room => {
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
  'Crew Quarters',
  'Engineering',
  'Storage',
  'Reactor',
  'Engine Room',
]

function labelRooms(rooms, fittings) {
  const fittingLabels = fittings
    .filter(fitting => fitting.room)
    .map(fitting => fitting.value)
  const labels = shuffle([...commonLabels, ...fittingLabels])
  return rooms.map(room => {
    return { ...room, label: room.label || labels.pop() }
  })
}

function createBridge() {
  const width = random(10, 20) * 10
  const height = random(10, 20) * 10
  const x = 10
  const y = (svgHeight - height) / 2
  return { width, height, x, y, label: 'Bridge' }
}

function createSection(hullType) {
  let sectionRooms = []
  const sectionWidth = random(10, 20) * 10
  const maxRooms = Math.min(hullType.maxRooms - rooms.length, 3)
  const roomCount = random(1, maxRooms)
  if (roomCount === 1) {
    sectionRooms = [...sectionRooms, ...createCenterRoom(sectionWidth)]
  }
  if (roomCount === 2) {
    sectionRooms = [...sectionRooms, ...createDoubleRooms(sectionWidth)]
  }
  if (roomCount === 3) {
    sectionRooms = [...sectionRooms, ...createTripleRooms(sectionWidth)]
  }
  return sectionRooms
}

function createCenterRoom(sectionWidth) {
  const lastRoom = last(rooms)
  const width = sectionWidth
  const height = random(10, 20) * 10
  const x = lastRoom.x + lastRoom.width
  const y = (svgHeight - height) / 2
  return [{ width, height, x, y }]
}

function createDoubleRooms(sectionWidth) {
  const lastRoom = last(rooms)
  const width = sectionWidth
  const height = random(10, 20) * 10
  const x = lastRoom.x + lastRoom.width
  const firstY = svgHeight / 2 - height
  const secondY = svgHeight / 2
  return [{ width, height, x, y: firstY }, { width, height, x, y: secondY }]
}

function createTripleRooms(sectionWidth) {
  const lastRoom = last(rooms)
  const width = sectionWidth
  const centerHeight = random(10, 20) * 10
  const sideHeight = random(10, 20) * 10
  const x = lastRoom.x + lastRoom.width
  const firstY = (svgHeight - centerHeight) / 2
  const secondY = (svgHeight - centerHeight) / 2 - sideHeight
  const thirdY = (svgHeight - centerHeight) / 2 + centerHeight
  return [
    { width, height: centerHeight, x, y: firstY },
    { width, height: sideHeight, x, y: secondY },
    { width, height: sideHeight, x, y: thirdY }
  ]
}

function roomIntersects(newRoom) {
  rooms.forEach(room => {
    return room._x0 <= newRoom._x1
      && room._x1 >= newRoom._x0
      && room._y0 <= newRoom._y1
      && room._y1 >= newRoom._y0
  })
}