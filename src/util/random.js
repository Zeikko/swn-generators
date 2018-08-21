import { random } from 'lodash'

export function pickRandom(options) {
  return options[random(0, options.length - 1)]
}