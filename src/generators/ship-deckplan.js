import * as d3 from 'd3'
import { random, last, shuffle, flattenDeep, sum, get, orderBy } from 'lodash'
import { generateDeck } from './deck'

const containerHeight = 800

export function generateDeckplan(hullType, fittings) {
  const svg = d3.select('svg')
  console.log(svg)
  const labels = getLabels(fittings)
  svg.selectAll('*').remove()
  const deck = generateDeck({ containerHeight, roomCount: hullType.maxRooms, labels })
  const rooms = flattenDeep(deck.sections.map(section => section.rows.map(row => row.rooms)))
  renderSections(svg, deck.sections)
  renderRooms(svg, rooms)
}

function getLabels(fittings) {
  const fittingLabels = fittings
    .filter(fitting => fitting.room)
    .map(fitting => ({
      value: fitting.value
    }))
  return [...necessaryLabels, ...fittingLabels, ...bonusLabels ]
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
      .attr('stroke-width', 3)
    renderRooms(svg, section.rows)
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
    svg.append('text')
      .attr('x', room.x + room.width / 2)
      .attr('y', room.y + room.height / 2)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .text(get(room, 'label.value'))
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
