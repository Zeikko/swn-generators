import { generateRoom } from './room'

export function generateRow({ roomCount, x, y, width, height, corridor, label }) {
  const roomWidth = width / roomCount
  let rooms = []
  for (let column = 0; column < roomCount; column++) {
    const roomX = x + column * roomWidth
    const room = generateRoom({ x: roomX, y, width: roomWidth, height, label })
    rooms = [...rooms, room]
  }
  return { rooms, x, y, width, height }
}