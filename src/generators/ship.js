import { pickRandom, pickWeightedRandom } from '../util/random'
import { buyMostExpensive, generateMoney, buyRandom, calculateCostForHullClass } from '../util/money'

export function generateShip() {
  let fittings = []
  let defences = []
  let weapons = []
  const purpose = generatePurpose()
  let money = generateMoney(purpose.minMoney, purpose.maxMoney)
  const startMoney = money
  const hullType = generateHullType(money)
  money = money - hullType.cost
  const fitting = generateFitting(money, hullType.hullClass)
  money = money - calculateCostForHullClass(fitting, hullType.hullClass)
  fittings = [ ...fittings, fitting]
  const defence = generateDefence(money, hullType.hullClass)
  money = money - calculateCostForHullClass(defence, hullType.hullClass)
  defences = [ ...defences, defence]
  return {
    purpose,
    hullType,
    complication: generateComplication(),
    state: generateState(),
    fittings,
    defences
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
    { value: 'Strike Fighter', cost: 200000, hullClass: 'Fighter' },
    { value: 'Shuttle', cost: 200000, hullClass: 'Fighter' },
    { value: 'Free Merchant', cost: 500000, hullClass: 'Fighter' },
    { value: 'Patrol Boat', cost: 2500000, hullClass: 'Fighter' },
    { value: 'Corvette', cost: 4000000, hullClass: 'Fighter' },
    { value: 'Heavy Frigate', cost: 7000000, hullClass: 'Fighter' },
    { value: 'Bulk Freighter', cost: 5000000, hullClass: 'Cruiser' },
    { value: 'Fleet Cruiser', cost: 10000000, hullClass: 'Cruiser' },
    { value: 'Battleship', cost: 50000000, hullClass: 'Capital' },
    { value: 'Carrier', cost: 60000000, hullClass: 'Capital' },
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

export function generateFitting(money, hullClass) {
  const options = [
    { value: 'Advanced lab',               cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Advanced nav computer',      cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Amphibious operation',       cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Armory',                     cost: 10000,   costMultiplier: true,  power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Atmospheric configuration',  cost: 5000,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Fighter' },
    { value: 'Auto-targeting system',      cost: 50000,   costMultiplier: false, power: 1, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Automation support',         cost: 10000,   costMultiplier: true,  power: 2, powerMultiplier: true , mass: 1,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Boarding tubes',             cost: 5000,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Cargo lighter',              cost: 25000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 2,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Cargo space',                cost: 0,       costMultiplier: false, power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Cold sleep pods',            cost: 5000,    costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Colony core',                cost: 100000,  costMultiplier: true,  power: 4, powerMultiplier: false, mass: 2,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drill course regulator',     cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Drive-2 upgrade',            cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-3 upgrade',            cost: 20000,   costMultiplier: true,  power: 2, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-4 upgrade',            cost: 40000,   costMultiplier: true,  power: 2, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-5 upgrade',            cost: 100000,  costMultiplier: true,  power: 3, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-6 upgrade',            cost: 500000,  costMultiplier: true,  power: 3, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Cruiser' },
    { value: 'Drop pod',                   cost: 300000,  costMultiplier: false, power: 0, powerMultiplier: false, mass: 2,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Emissions dampers',          cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 1,   massMultiplier: true,  hullClass: 'Cruiser' },
    { value: 'Exodus bay',                 cost: 50000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Extended life support',      cost: 5000,    costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 1,   massMultiplier: true,  hullClass: 'Fighter' },
    { value: 'Extended medbay',            cost: 5000,    costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Extended stores',            cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Fighter' },
    { value: 'Fuel bunkers',               cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Fuel scoops',                cost: 5000,    costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Hydroponic production',      cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: true,  hullClass: 'Cruiser' },
    { value: 'Lifeboats',                  cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Luxury cabins',              cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Mobile extractor',           cost: 50000,   costMultiplier: false, power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Mobile factory',             cost: 50000,   costMultiplier: true,  power: 3, powerMultiplier: false, mass: 2,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Precognitive nav chamber',   cost: 100000,  costMultiplier: true,  power: 1, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
  //{ value: 'Psionic anchorpoint',        cost: 10000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Sensor mask',                cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Ship bay/fighter',           cost: 200000,  costMultiplier: false, power: 0, powerMultiplier: false, mass: 2,   massMultiplier: false, hullClass: 'Cruiser' },
    { value: 'Ship bay/frigate',           cost: 1000000, costMultiplier: false, power: 1, powerMultiplier: false, mass: 4,   massMultiplier: false, hullClass: 'Capital' },
    { value: 'Ship’s locker',              cost: 2000,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Shiptender mount',           cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Smuggler’s hold',            cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Survey sensor array',        cost: 5000,    costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'System drive',               cost: 0,       costMultiplier: false, power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: true,  hullClass: 'Fighter' },
  //{ value: 'Teleportation pads',         cost: 10000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Tractor beams',              cost: 10000,   costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Vehicle transport fittings', cost: 10000,   costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Workshop',                   cost: 500,     costMultiplier: true,  power: 1, powerMultiplier: false, mass: 0.5, massMultiplier: true,  hullClass: 'Frigate' },
  ]
  const fittingsForHullClass = filterByHullClass(options, hullClass)
  return buyRandom(options, hullClass, money)
}

export function generateDefence(money, hullClass) {
  const options = [
    { value: 'Ablative Hull Compartments',   cost: 100000, costMultiplier: true, power: 5, powerMultiplier: false, mass: 2, massMultiplier: true, hullClass: 'Capital' },
    { value: 'Augmented Plating',            cost: 25000,  costMultiplier: true, power: 0, powerMultiplier: false, mass: 1, massMultiplier: true, hullClass: 'Fighter' },
    { value: 'Boarding Countermeasures',     cost: 25000,  costMultiplier: true, power: 2, powerMultiplier: false, mass: 1, massMultiplier: true, hullClass: 'Frigate' },
    { value: 'Burst ECM Generator',          cost: 25000,  costMultiplier: true, power: 2, powerMultiplier: false, mass: 1, massMultiplier: true, hullClass: 'Frigate' },
    { value: 'Foxer Drones',                 cost: 10000,  costMultiplier: true, power: 2, powerMultiplier: false, mass: 1, massMultiplier: true, hullClass: 'Cruiser' },
    { value: 'Grav Eddy Displacer',          cost: 50000,  costMultiplier: true, power: 5, powerMultiplier: false, mass: 2, massMultiplier: true, hullClass: 'Frigate' },
    { value: 'Hardened Polyceramic Overlay', cost: 25000,  costMultiplier: true, power: 0, powerMultiplier: false, mass: 1, massMultiplier: true, hullClass: 'Fighter' },
    { value: 'Planetary Defense Array',      cost: 50000,  costMultiplier: true, power: 4, powerMultiplier: false, mass: 2, massMultiplier: true, hullClass: 'Frigate' },
    { value: 'Point Defense Lasers',         cost: 10000,  costMultiplier: true, power: 3, powerMultiplier: false, mass: 2, massMultiplier: true, hullClass: 'Frigate' },
  ]
  const fittingsForHullClass = filterByHullClass(options, hullClass)
  return buyRandom(options, hullClass, money)
}

function filterByHullClass(options, hullClass) {
  return options.filter(({ hullClass }) => {
    if (hullClass === 'Capital') {
      return true
    }
    if (hullClass === 'Cruiser') {
      return options.hullClass !== 'Capital'
    }
    if (hullClass === 'Frigate') {
      return options.hullClass === 'Fighter' || options.hullClass === 'Frigate'
    }
    if (hullClass === 'Fighter') {
      return options.hullClass === 'Fighter'
    }
  })
}
