import { sortBy, last, random } from 'lodash'
import { calculateMassForHullClass } from './mass'
import { calculatePowerForHullClass } from './power'

export function buyMostExpensive(options, money) {
  const purchasableOptions = options.filter(option => option.cost <= money)
  const sortedOptions = sortBy(purchasableOptions, 'cost')
  const { cost: mostExpensivePrice } = last(sortedOptions)
  const mostExpensiveOptions = options.filter(option => option.cost === mostExpensivePrice)
  return mostExpensiveOptions[random(0, mostExpensiveOptions.length - 1)]
}

export function generateMoney(minMoney, maxMoney) {
  const minx = Math.pow(minMoney, 1/3)
  const maxx = Math.pow(maxMoney, 1/3)
  const x = random(minx, maxx)
  return Math.round(Math.pow(x, 3))
}

export function buyRandom(options, hullClass, resources, existingOptions) {
  const optionsForHullClass = filterByHullClass(options, hullClass)
  const optionsFilteredByCost = optionsForHullClass.filter(option => calculateCostForHullClass(option, hullClass) <= resources.money)
  const optionsFilteredByMass = optionsFilteredByCost.filter(option => calculateMassForHullClass(option, hullClass) <= resources.mass)
  const optionsFilteredByPower = optionsFilteredByMass.filter(option => calculatePowerForHullClass(option, hullClass) <= resources.power)
  const optionsFilteredByHard = optionsFilteredByPower.filter(option => (option.hard || 0) <= resources.hard)
  const existingValues = existingOptions.map(option => option.value)
  const optionsFilteredByExisting = optionsFilteredByHard.filter(option => !existingValues.includes(option.value) || option.multiple)
  return optionsFilteredByExisting[random(0, optionsFilteredByExisting.length - 1)]
}

export function calculateCostForHullClass(option, hullClass) {
  if (option.costMultiplier) {
    switch (hullClass) {
      case 'Fighter':
        return option.cost
      case 'Frigate':
        return option.cost * 10
      case 'Cruiser':
        return option.cost * 25
      case 'Capital':
        return option.cost * 100
    }
  } else {
    return option.cost
  }
}

function filterByHullClass(options, hullClass) {
  return options.filter((option) => {
    if (hullClass === 'Capital') {
      return true
    }
    if (hullClass === 'Cruiser') {
      return option.hullClass !== 'Capital'
    }
    if (hullClass === 'Frigate') {
      return option.hullClass === 'Fighter' || option.hullClass === 'Frigate'
    }
    if (hullClass === 'Fighter') {
      return option.hullClass === 'Fighter'
    }
  })
}
