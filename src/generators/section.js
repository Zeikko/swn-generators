import { random, max } from 'lodash'

import { generateRow } from './row'

const maxRowsCount = 4
const maxRoomsPerRow = 3

export function generateSection({ containerHeight, x, roomCount }) {
  let rows = generateRowCount(roomCount)
  const rowCount = rows.length
  const columnCount = max(rows.map(row => row.rowRoomCount))
  const width = columnCount * generateRandomLength(2, 4)
  const height = rowCount * generateRandomLength(2, 5)
  const y = (containerHeight - height) / 2
  const rowHeight = height / rowCount
  rows = rows.map((row, i) => {
    const rowY = y + i * rowHeight
    return generateRow({ roomCount: row.rowRoomCount, x, y: rowY, width, height: rowHeight })
  })
  return { x, y, width, height, rows, rowCount, columnCount }
}

function generateRandomLength(min, max) {
  return random(min, max) * 40
}

function generateRowCount(roomCount) {
  let rows = []
  let roomsLeft = roomCount
  while (roomsLeft > 0) {
    const rowRoomCount = random(1, Math.min(roomsLeft, maxRoomsPerRow))
    rows = [...rows, { rowRoomCount }]
    roomsLeft = roomsLeft - rowRoomCount
  }
  return rows
}
