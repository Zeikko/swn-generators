import { random, max, sum, splice } from 'lodash'

import { generateRow } from './row'

const maxRowsCount = 4
const maxRoomsPerRow = 3

export function generateSection({ containerHeight, x, roomCount }) {
  let rows = generateRowCount(roomCount)
  const rowCount = rows.length
  rows = generateRowHeights(rows, rowCount)
  const corridorCount = generateCorridorCount(rowCount)
  rows = insertCorridorRow(rows, corridorCount, rowCount)
  const columnCount = max(rows.map(row => row.rowRoomCount))
  const width = columnCount * generateRandomLength(2, 4)
  const height = sum(rows.map(row => row.height))
  const y = (containerHeight - height) / 2
  const rowHeight = height / rowCount

  console.log(rows)
  let rowY = y
  rows = rows.map((row, i) => {
    const rowWithRooms = generateRow({ roomCount: row.rowRoomCount, x, y: rowY, width, ...row })
    rowY = rowY + row.height
    return rowWithRooms
  })
  return { x, y, width, height, rows, rowCount, columnCount, corridorCount, roomCount }
}

function generateRandomLength(min, max) {
  return random(min, max) * 40
}

function generateRowCount(roomCount) {
  let rows = []
  let roomsLeft = roomCount
  while (roomsLeft > 0) {
    const max = Math.max(Math.min(Math.floor(roomsLeft / 2), maxRoomsPerRow), 1)
    const rowRoomCount = random(1, max)
    rows = [...rows, { rowRoomCount }]
    roomsLeft = roomsLeft - rowRoomCount
  }
  return rows
}

function generateCorridorCount(rowCount) {
  const max = Math.floor(rowCount / 2)
  const corridorCount = random(0, max)
  if (rowCount % 2 === 1 && corridorCount % 2 === 1) {
   return corridorCount - 1 + (random(0, 1) * 2)
  }
  return corridorCount
}

function insertCorridorRow(rows, corridorCount, rowCount) {
  let rowsWithCorridors = rows
  const center = Math.ceil(rowCount / 2)
  if (rowCount % 2 === 0 && corridorCount % 2 === 1) {
    rowsWithCorridors.splice(center, 0, { roomCount: 1, label: { value: 'Corridor' }, height: 40 })
  }
  if (corridorCount === 2) {
    rowsWithCorridors.splice(center - 1, 0, { roomCount: 1, label: { value: 'Corridor' }, height: 40 })
    rowsWithCorridors.splice(center + 1, 0, { roomCount: 1, label: { value: 'Corridor' }, height: 40 })
  }
  return rowsWithCorridors
}

function generateRowHeights(rows, rowCount) {
  let heights = {}
  let rowsWithHeights = rows.map((row, i) => {
    const distanceFromCenter = Math.abs(((rowCount -1) / 2) - i)
    console.log('distanceFromCenter', distanceFromCenter)
    if (!heights[distanceFromCenter]) {
      heights[distanceFromCenter] = generateRandomLength(2, 4)
    }
    return { ...row, height: heights[distanceFromCenter] }
  })
  return rowsWithHeights
}