import { generateRow } from './row'

export function generateVerticalCorridor(options) {
  const { x, y, height, containerHeight } = options
  const rows = [generateRow({
    roomCount: 1,
    x,
    y,
    width: 40,
    height,
    labels: [{ value: 'Corr.' }]
  })]
  return { ...options, rows, y, width: 40 }
}