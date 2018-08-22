import { sortBy, last, random } from 'lodash'

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

export function buyRandom(options, hullClass, money) {
  const purchasableOptions = options.filter(option => calculateCostForHullClass(option, hullClass) <= money)
  return purchasableOptions[random(0, purchasableOptions.length - 1)]
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
