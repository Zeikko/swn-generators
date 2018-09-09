import { random } from 'lodash'

import { generateRoom } from './room'

const maxRowsCount = 4

export function generateSection({ containerHeight, x, roomCount }) {
  const rowCount = generateRowCount(roomCount)
  const columnCount = Math.ceil(roomCount / rowCount)
  const width = columnCount * generateRandomLength(2, 5)
  const height = rowCount * generateRandomLength(2, 5)
  const y = (containerHeight - height) / 2
  console.log({ roomCount, rowCount, columnCount })
  let rooms = []
  const roomHeight = height / rowCount
  const roomWidth = width / columnCount
  for (let row = 0; row < rowCount; row++) {
    const roomY = y + row * roomHeight
    for (let column = 0; column < columnCount; column++) {
      const roomX = x + column * roomWidth
      const room = generateRoom({ x: roomX, y: roomY, width: roomWidth, height: roomHeight })
      rooms = [...rooms, room]
    }
  }
  return { x, y, width, height, rooms }
}

function generateRandomLength(min, max) {
  return random(min, max) * 40
}

function generateRowCount(roomCount) {
  return random(2, roomCount)
}

