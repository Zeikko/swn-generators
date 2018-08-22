import { random, flatten } from 'lodash'

export function pickRandom(options) {
  return options[random(0, options.length - 1)]
}

export function pickWeightedRandom(options) {
  const multipliedOptions = options.map(option => multiplyObject(option, option.weight))
  const weightedOptions = flatten(multipliedOptions)
  return weightedOptions[random(0, weightedOptions.length - 1)]
}

function multiplyObject(object, times) {
  let objects = []
  for (let i = 0; i < times; i++) {
    objects = [...objects, object]
  }
  return objects
}
