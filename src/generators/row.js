import { random } from 'lodash'

import { generateRoom } from './room'

export function generateRow({ roomCount, x, y, width, height, labels }) {
  const rowLabels = [ ...labels ]
  const roomWidth = width / roomCount
  let rooms = []
  for (let column = 0; column < roomCount; column++) {
    const label = rowLabels.splice(random(0, labels.length - 1), 1)[0]
    const roomX = x + column * roomWidth
    const room = generateRoom({ x: roomX, y, width: roomWidth, height, label })
    rooms = [...rooms, room]
  }
  return { rooms, x, y, width, height }
}