import { pickRandom, pickWeightedRandom } from '../util/random'
import { buyMostExpensive, generateMoney } from '../util/money'

export function generateShip() {
  const purpose = generatePurpose()
  let money = generateMoney(purpose.minMoney, purpose.maxMoney)
  const startMoney = money
  const hullType = generateHullType(money)
  money = money - hullType.cost
  return {
    purpose,
    hullType,
    complication: generateComplication(),
    state: generateState(),
  }
}

export function generatePurpose() {
  const options = [
    { value: 'Bounty Hunter', weight: 2, minMoney: 300000, maxMoney: 8000000 },
    { value: 'Pirate', weight: 2, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Smuggler', weight: 2, minMoney: 300000, maxMoney: 6000000 },
    { value: 'Merchant', weight: 6, minMoney: 300000, maxMoney: 8000000 },
    { value: 'Spy', weight: 1, minMoney: 300000, maxMoney: 8000000 },
    { value: 'Diplomat', weight: 2, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Explorer', weight: 2, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Military', weight: 2, minMoney: 300000, maxMoney: 70000000 },
    { value: 'Research', weight: 1, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Maintenance', weight: 2, minMoney: 300000, maxMoney: 5000000 },
  ]
  return pickWeightedRandom(options)
}

export function generateHullType(money) {
  const options = [
    { value: 'Strike Fighter', cost: 200000, class: 'Fighter' },
    { value: 'Shuttle', cost: 200000, class: 'Fighter' },
    { value: 'Free Merchant', cost: 500000, class: 'Fighter' },
    { value: 'Patrol Boat', cost: 2500000, class: 'Fighter' },
    { value: 'Corvette', cost: 4000000, class: 'Fighter' },
    { value: 'Heavy Frigate', cost: 7000000, class: 'Fighter' },
    { value: 'Bulk Freighter', cost: 5000000, class: 'Cruiser' },
    { value: 'Fleet Cruiser', cost: 10000000, class: 'Cruiser' },
    { value: 'Battleship', cost: 50000000, class: 'Capital' },
    { value: 'Carrier', cost: 60000000, class: 'Capital' },
  ]
  return buyMostExpensive(options, money)
}

export function generateComplication() {
  const options = [
    'None',
    'Spike drive broken',
    'Life support broken',
    'Captain wounded',
    'Pilot lost',
    'Out of fuel',
    'Engine failure',
    'Fuel bleed',
    'Cargo loss',
    'Chased by law enforcement',
    'Chased by pirates',
    'Mutiny',
    'Infected crew',
    'Wanted by the officials',
  ]
  return pickRandom(options)
}

export function generateState() {
  const options = [
    'Going to closest spaceport',
    'Making Spike Drill',
    'Hiding',
    'Searching',
    'Traveling to a world in this sector',
    'Patrolling',
  ]
  return pickRandom(options)
}