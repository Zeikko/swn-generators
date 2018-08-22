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
