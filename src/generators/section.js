import { random, max, sum, splice, shuffle } from 'lodash'

import { generateRow } from './row'

const maxRowsCount = 4
const maxRoomsPerRow = 3

export function generateSection({ containerHeight, x, roomCount, labels, isFirstSection, isLastSection }) {
  let rows = generateRowCount(roomCount)
  const rowCount = rows.length
  rows = generateRowHeights(rows, rowCount)
  rows = groupLabels(rows, labels)
  const corridorCount = generateCorridorCount(rowCount)
  rows = insertCorridorRow(rows, corridorCount, rowCount)
  const columnCount = max(rows.map(row => row.rowRoomCount))
  const width = columnCount * generateRandomLength(2, 4)
  const height = sum(rows.map(row => row.height))
  const y = (containerHeight - height) / 2
  const rowHeight = height / rowCount
  let rowY = y
  rows = rows.map((row, i) => {
    const rowWithRooms = generateRow({ roomCount: row.rowRoomCount, x, y: rowY, width, ...row })
    rowY = rowY + row.height
    return rowWithRooms
  })
  return { x, y, width, height, rows, rowCount, columnCount, corridorCount, roomCount, isFirstSection, isLastSection }
}

function generateRandomLength(min, max) {
  return random(min, max) * 40
}

function generateRowCount(roomCount) {
  let rows = []
  let roomsLeft = roomCount
  while (roomsLeft > 0) {
    const max = Math.max(Math.min(Math.floor(roomsLeft / 1.5), maxRoomsPerRow), 1)
    const rowRoomCount = random(1, max)
    rows = [...rows, { rowRoomCount }]
    roomsLeft = roomsLeft - rowRoomCount
  }
  return shuffle(rows)
}

function generateCorridorCount(rowCount) {
  const corridorCount = random(0, rowCount)
  return corridorCount
}

function insertCorridorRow(rows, corridorCount, rowCount) {
  const corridor = { roomCount: 1, labels: [{ value: 'Corridor' }], height: 40 }
  let rowsWithCorridors = rows
  const center = Math.ceil(rowCount / 2)
  if (rowCount % 2 === 0 && corridorCount % 2 === 1) {
    rowsWithCorridors.splice(center, 0, corridor)
  }
  if (rowCount % 2 === 1 && (corridorCount === 2 || corridorCount === 3)) {
    rowsWithCorridors.splice(center - 1, 0, corridor)
    rowsWithCorridors.splice(center + 1, 0, corridor)
  }
  if (rowCount === 2 && corridorCount === 2) {
    rowsWithCorridors.splice(0, 0, corridor)
    rowsWithCorridors.splice(3, 0, corridor)
  }
  return rowsWithCorridors
}

function generateRowHeights(rows, rowCount) {
  let heights = {}
  let rowsWithHeights = rows.map((row, i) => {
    const distanceFromCenter = Math.abs(((rowCount -1) / 2) - i)
    if (!heights[distanceFromCenter]) {
      heights[distanceFromCenter] = generateRandomLength(2, 4)
    }
    return { ...row, height: heights[distanceFromCenter] }
  })
  return rowsWithHeights
}

function groupLabels(rows, labels) {
  return rows.map(row => {
    const rowLabels = labels.splice(0, row.rowRoomCount)
    return { labels: rowLabels, ...row }
  })
}