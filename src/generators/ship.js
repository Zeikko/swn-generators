import { random, groupBy, map } from 'lodash'
import { pickRandom, pickWeightedRandom } from '../util/random'
import { buyMostExpensive, generateMoney, buyRandom, calculateCostForHullClass } from '../util/money'
import { calculateMassForHullClass } from '../util/mass'
import { calculatePowerForHullClass } from '../util/power'
import { generateShipName } from './name'

export function generateShip() {
  const name = generateShipName()
  let weapons = []
  let fittings = []
  let defences = []
  const purpose = generatePurpose()
  const { aggressiveness } = purpose
  let startMoney = generateMoney(purpose.minMoney, purpose.maxMoney)
  const hullType = generateHullType(startMoney)
  let { power, mass, hard } = hullType
  let resources = { money: startMoney, power, mass, hard }
  resources.money = resources.money - hullType.cost
  let fitting = true
  while (fitting) {
    const weapon = generateWeapon(resources, hullType.hullClass, purpose, weapons)
    if (weapon) {
      resources = calculateResources(resources, hullType, weapon)
      weapons = [ ...weapons, weapon]
    }
    const defence = generateDefence(resources, hullType.hullClass, purpose, defences)
    if (defence) {
      resources = calculateResources(resources, hullType, defence)
      defences = [ ...defences, defence]
    }
    fitting = generateFitting(resources, hullType.hullClass, purpose, fittings)
    if (fitting) {
      resources = calculateResources(resources, hullType, fitting)
      fittings = [ ...fittings, fitting]
    }
  }
  const groupedFittings = groupBy(fittings, 'value')
  const fittingsWithCounts = map(groupedFittings, group => ({ ...group[0], count: group.length }))
  const fittingsWithCargoSpace = calculateCargoSpace(fittingsWithCounts, hullType.hullClass)
  return {
    name,
    purpose,
    hullType,
    complication: generateComplication(),
    state: generateState(),
    fittings: fittingsWithCargoSpace,
    weapons,
    defences,
    resources,
    startMoney,
  }
}

export function generatePurpose() {
  const options = [
    { value: 'Bounty Hunter', weight: 2, aggressiveness: 6,  minMoney: 300000, maxMoney: 8000000, weights: { aggression: 4, travel: 4, drive: 4 }},
    { value: 'Pirate',        weight: 2, aggressiveness: 8,  minMoney: 300000, maxMoney: 5000000, weights: { aggression: 8, stealth: 4, trade: 4 } },
    { value: 'Smuggler',      weight: 2, aggressiveness: 6,  minMoney: 800000, maxMoney: 6000000, weights: { aggression: 4, stealth: 8, survival: 4, trade: 8 } },
    { value: 'Merchant',      weight: 6, aggressiveness: 4,  minMoney: 300000, maxMoney: 8000000, weights: { drive: 4, travel: 4, trade: 8 } },
    { value: 'Spy',           weight: 1, aggressiveness: 4,  minMoney: 300000, maxMoney: 8000000, weights: { stealth: 8, drive: 4 } },
    { value: 'Diplomat',      weight: 2, aggressiveness: 2,  minMoney: 300000, maxMoney: 5000000, weights: { drive: 8, travel: 8, luxury: 8, survival: 4 } },
    { value: 'Explorer',      weight: 2, aggressiveness: 2,  minMoney: 300000, maxMoney: 5000000, weights: { drive: 8, travel: 4, exploration: 8, survival: 4 } },
    { value: 'Military',      weight: 2, aggressiveness: 10, minMoney: 300000, maxMoney: 70000000, weights: { aggression: 8 } },
    { value: 'Research',      weight: 1, aggressiveness: 2,  minMoney: 300000, maxMoney: 5000000, weights: { research: 8, luxury: 4, colonial: 4 } },
    { value: 'Maintenance',   weight: 2, aggressiveness: 2,  minMoney: 300000, maxMoney: 5000000, weights: { industry: 8, survival: 4 } },
    { value: 'Colonist',      weight: 1, aggressiveness: 2,  minMoney: 3000000, maxMoney: 7000000, weights: { industry: 4, travel: 4, drive: 4, exploration: 4, survival: 4, colonial: 3 } },
  ]
  return pickWeightedRandom(options)
}

export function generateHullType(money) {
  const options = [
    { value: 'Strike Fighter', cost: 200000, hullClass: 'Fighter', power: 5, mass: 2, hard: 1 },
    { value: 'Shuttle', cost: 200000, hullClass: 'Fighter', power: 3, mass: 5, hard: 1 },
    { value: 'Free Merchant', cost: 500000, hullClass: 'Frigate', power: 10, mass: 15, hard: 2 },
    { value: 'Patrol Boat', cost: 2500000, hullClass: 'Frigate', power: 15, mass: 10, hard: 4 },
    { value: 'Corvette', cost: 4000000, hullClass: 'Frigate', power: 15, mass: 15, hard: 6 },
    { value: 'Heavy Frigate', cost: 7000000, hullClass: 'Frigate', power: 25, mass: 20, hard: 8 },
    { value: 'Bulk Freighter', cost: 5000000, hullClass: 'Cruiser', power: 15, mass: 25, hard: 2 },
    { value: 'Fleet Cruiser', cost: 10000000, hullClass: 'Cruiser', power: 50, mass: 30, hard: 10 },
    { value: 'Battleship', cost: 50000000, hullClass: 'Capital', power: 75, mass: 50, hard: 15 },
    { value: 'Carrier', cost: 60000000, hullClass: 'Capital', power: 50, mass: 100, hard: 4 },
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

export function generateFitting(resources, hullClass, purpose, fittings) {
  const options = [
    { value: 'Advanced lab',               weight: 10,  group: 'research',    cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Advanced nav computer',      weight: 10,  group: 'travel',      cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Amphibious operation',       weight: 10,  group: 'stealth',     cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate', maxHullClass: 'Frigate' },
    { value: 'Armory',                     weight: 10,  group: 'aggression',  cost: 10000,   costMultiplier: true,  power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Atmospheric configuration',  weight: 50,  group: 'general',     cost: 5000,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Fighter', maxHullClass: 'Frigate' },
    { value: 'Auto-targeting system',      weight: 10,  group: 'aggression',  cost: 50000,   costMultiplier: false, power: 1, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Automation support',         weight: 10,  group: 'general',     cost: 10000,   costMultiplier: true,  power: 2, powerMultiplier: true , mass: 1,   massMultiplier: false, hullClass: 'Fighter' },
    { value: 'Boarding tubes',             weight: 10,  group: 'aggression',  cost: 5000,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Cargo lighter',              weight: 10,  group: 'trade',       cost: 25000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 2,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Cargo space',                weight: 10,  group: 'trade',       cost: 0,       costMultiplier: false, power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter', multiple: true },
    { value: 'Cold sleep pods',            weight: 10,  group: 'general',     cost: 5000,    costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate', multiple: true  },
    { value: 'Colony core',                weight: 10,  group: 'colonial',    cost: 100000,  costMultiplier: true,  power: 4, powerMultiplier: false, mass: 2,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drill course regulator',     weight: 4,   group: 'travel',      cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Drive-2 upgrade',            weight: 10,  group: 'drive',       cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-3 upgrade',            weight: 8,   group: 'drive',       cost: 20000,   costMultiplier: true,  power: 2, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-4 upgrade',            weight: 3,   group: 'drive',       cost: 40000,   costMultiplier: true,  power: 2, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-5 upgrade',            weight: 2,   group: 'drive',       cost: 100000,  costMultiplier: true,  power: 3, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Drive-6 upgrade',            weight: 1,   group: 'drive',       cost: 500000,  costMultiplier: true,  power: 3, powerMultiplier: true,  mass: 0,   massMultiplier: true,  hullClass: 'Cruiser' },
    { value: 'Drop pod',                   weight: 10,  group: 'aggression',  cost: 300000,  costMultiplier: false, power: 0, powerMultiplier: false, mass: 2,   massMultiplier: false, hullClass: 'Frigate', multiple: true },
    { value: 'Emissions dampers',          weight: 10,  group: 'stealth',     cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 1,   massMultiplier: true,  hullClass: 'Cruiser' },
    { value: 'Exodus bay',                 weight: 10,  group: 'colonial',    cost: 50000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: false, hullClass: 'Frigate', multiple: true },
    { value: 'Extended life support',      weight: 6,   group: 'survival',    cost: 5000,    costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 1,   massMultiplier: true,  hullClass: 'Fighter', multiple: true },
    { value: 'Extended medbay',            weight: 10,  group: 'survival',    cost: 5000,    costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Extended stores',            weight: 6,   group: 'survival',    cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Fighter', multiple: true  },
    { value: 'Fuel bunkers',               weight: 6,   group: 'travel',      cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter', multiple: true  },
    { value: 'Fuel scoops',                weight: 10,  group: 'survival',    cost: 5000,    costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Hydroponic production',      weight: 10,  group: 'industry',    cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: true,  hullClass: 'Cruiser', multiple: true },
    { value: 'Lifeboats',                  weight: 10,  group: 'survival',    cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Luxury cabins',              weight: 10,  group: 'luxury',      cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate', multiple: true },
    { value: 'Mobile extractor',           weight: 10,  group: 'industry',    cost: 50000,   costMultiplier: false, power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Mobile factory',             weight: 10,  group: 'industry',    cost: 50000,   costMultiplier: true,  power: 3, powerMultiplier: false, mass: 2,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Precognitive nav chamber',   weight: 10,  group: 'travel',      cost: 100000,  costMultiplier: true,  power: 1, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
  //{ value: 'Psionic anchorpoint',        weight: 10,  group: '',            cost: 10000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Sensor mask',                weight: 10,  group: 'stealth',     cost: 10000,   costMultiplier: true,  power: 1, powerMultiplier: true,  mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Ship bay/fighter',           weight: 10,  group: 'aggression',  cost: 200000,  costMultiplier: false, power: 0, powerMultiplier: false, mass: 2,   massMultiplier: false, hullClass: 'Cruiser', multiple: true },
    { value: 'Ship bay/frigate',           weight: 10,  group: 'aggression',  cost: 1000000, costMultiplier: false, power: 1, powerMultiplier: false, mass: 4,   massMultiplier: false, hullClass: 'Capital', multiple: true },
    { value: 'Ship’s locker',              weight: 10,  group: 'general',     cost: 2000,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Shiptender mount',           weight: 10,  group: 'industry',    cost: 25000,   costMultiplier: true,  power: 1, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Smuggler’s hold',            weight: 10,  group: 'stealth',     cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter', multiple: true },
    { value: 'Survey sensor array',        weight: 10,  group: 'exploration', cost: 5000,    costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'System drive',               weight: 2,  group: 'bad-drive',    cost: 0,       costMultiplier: false, power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: true,  hullClass: 'Fighter' },
  //{ value: 'Teleportation pads',         weight: 10,  group: '',            cost: 10000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Tractor beams',              weight: 10,  group: 'general',     cost: 10000,   costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Vehicle transport fittings', weight: 10,  group: 'aggression',  cost: 10000,   costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Workshop',                   weight: 10,  group: 'industry',    cost: 500,     costMultiplier: true,  power: 1, powerMultiplier: false, mass: 0.5, massMultiplier: true,  hullClass: 'Frigate' },
  ]
  const existingGroups = fittings.map(option => option.group)
  const optionsWithoutDuplicateDrive = options.filter(option => (!existingGroups.includes('drive') && !existingGroups.includes('bad-drive')) || option.group !== 'drive')
  return buyRandom(optionsWithoutDuplicateDrive, hullClass, resources, purpose, fittings)
}

export function generateDefence(resources, hullClass, purpose, defences) {
  if (random(1, 10) > (purpose.aggressiveness / 4)) {
    return
  }
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
  return buyRandom(options, hullClass, resources, purpose, defences)
}

export function generateWeapon(resources, hullClass, purpose, weapons) {
  if (random(1, 10) > purpose.aggressiveness) {
    return
  }
  const options = [
    { value: 'Multifocal Laser',           cost: 100000,   power: 5,  mass: 1,  hard: 1, hullClass: 'Fighter', damage: '1d4',     qualities: 'AP 20' },
    { value: 'Reaper Battery',             cost: 100000,   power: 4,  mass: 1,  hard: 1, hullClass: 'Fighter', damage: '3d4',     qualities: 'Clumsy' },
    { value: 'Fractal Impact Charge',      cost: 200000,   power: 5,  mass: 1,  hard: 1, hullClass: 'Fighter', damage: '2d6',     qualities: 'AP 15, Ammo 4' },
    { value: 'Polyspectral MES Beam',      cost: 2000000,  power: 5,  mass: 1,  hard: 1, hullClass: 'Fighter', damage: '2d4',     qualities: 'AP 25' },
    { value: 'Sandthrower',                cost: 50000,    power: 3,  mass: 1,  hard: 1, hullClass: 'Fighter', damage: '2d4',     qualities: 'Flak' },
    { value: 'Flak Emitter Battery',       cost: 500000,   power: 5,  mass: 3,  hard: 1, hullClass: 'Frigate', damage: '2d6',     qualities: 'AP 10, Flak' },
    { value: 'Torpedo Launcher',           cost: 500000,   power: 10, mass: 3,  hard: 1, hullClass: 'Frigate', damage: '3d8',     qualities: 'AP 20, Ammo 4' },
    { value: 'Charged Particle Caster',    cost: 800000,   power: 10, mass: 1,  hard: 2, hullClass: 'Frigate', damage: '3d6',     qualities: 'AP 15, Clumsy' },
    { value: 'Plasma Beam',                cost: 700000,   power: 5,  mass: 2,  hard: 2, hullClass: 'Frigate', damage: '3d6',     qualities: 'AP 10' },
    { value: 'Mag Spike Array',            cost: 1000000,  power: 5,  mass: 2,  hard: 2, hullClass: 'Frigate', damage: '2d6+2',   qualities: 'Flak, AP 10, Ammo 5' },
    { value: 'Nuclear Missiles',           cost: 50000,    power: 5,  mass: 1,  hard: 2, hullClass: 'Frigate', damage: 'Special', qualities: 'Ammo 5' },
    { value: 'Spinal Beam Cannon',         cost: 1500000,  power: 10, mass: 5,  hard: 3, hullClass: 'Cruiser', damage: '3d10',    qualities: 'AP 15, Clumsy' },
    { value: 'Smart Cloud ',               cost: 2000000,  power: 10, mass: 5,  hard: 2, hullClass: 'Cruiser', damage: '3d10',    qualities: 'Cloud, Clumsy' },
    { value: 'Gravcannon',                 cost: 2000000,  power: 15, mass: 4,  hard: 3, hullClass: 'Cruiser', damage: '4d6',     qualities: 'AP 20' },
    { value: 'Spike Inversion Projector',  cost: 2500000,  power: 10, mass: 3,  hard: 3, hullClass: 'Cruiser', damage: '3d8',     qualities: 'AP 15' },
    { value: 'Vortex Tunnel Inductor',     cost: 5000000,  power: 20, mass: 10, hard: 4, hullClass: 'Capital', damage: '3d20',    qualities: 'AP 20, Clumsy' },
    { value: 'Mass Cannon',                cost: 5000000,  power: 10, mass: 5,  hard: 4, hullClass: 'Capital', damage: '2d20',    qualities: 'AP 20, Ammo 4' },
    { value: 'Lightning Charge Mantle',    cost: 4000000,  power: 15, mass: 5,  hard: 2, hullClass: 'Capital', damage: '1d20',    qualities: 'AP 5, Cloud' },
    { value: 'Singularity Gun',            cost: 20000000, power: 25, mass: 10, hard: 5, hullClass: 'Capital', damage: '5d20',    qualities: 'AP 25' },
  ]
  return buyRandom(options, hullClass, resources, purpose, weapons)
}

function calculateResources(resources, hullType, option) {
  const money = resources.money - calculateCostForHullClass(option, hullType.hullClass)
  const mass = resources.mass - calculateMassForHullClass(option, hullType.hullClass)
  const power = resources.power - calculatePowerForHullClass(option, hullType.hullClass)
  const hard = resources.hard - (option.hard || 0)
  return { money, mass, power, hard }
}

function calculateCargoSpace(fittings, hullClass) {
  let cargoCount = 0
  let smugglersCount = 0
  let fittingsWithoutCargo = fittings.filter(fitting => {
    if (fitting.value === 'Cargo space') {
      cargoCount = cargoCount + 1
    }
    if (fitting.value === 'Smuggler’s hold') {
      smugglersCount = smugglersCount + 1
    }
    return fitting.value !== 'Cargo space' && fitting.value !== 'Smuggler’s hold' 
  })
  const cargoMultiplier = calculateCargoMultiplier(hullClass)
  if (cargoCount) {
    fittingsWithoutCargo = [ ...fittingsWithoutCargo, { value: `${cargoCount * cargoMultiplier} tons of cargo space` }]
  }
  if (smugglersCount) {
    fittingsWithoutCargo = [ ...fittingsWithoutCargo, { value: `${smugglersCount * cargoMultiplier / 10} tons of smuggler's hold` }]
  }
  return fittingsWithoutCargo
}

function calculateCargoMultiplier(hullClass) {
  switch (hullClass) {
    case 'Fighter':
      return 2
    case 'Frigate':
      return 20
    case 'Cruiser':
      return 200
    case 'Capital':
      return 2000
  }
}
