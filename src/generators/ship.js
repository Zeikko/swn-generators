import { random } from 'lodash'
import { pickRandom, pickWeightedRandom } from '../util/random'
import { buyMostExpensive, generateMoney, buyRandom, calculateCostForHullClass } from '../util/money'
import { calculateMassForHullClass } from '../util/mass'
import { calculatePowerForHullClass } from '../util/power'

export function generateShip() {
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
    const weapon = generateWeapon(resources, hullType.hullClass, aggressiveness, weapons)
    if (weapon) {
      resources = calculateResources(resources, hullType, weapon)
      weapons = [ ...weapons, weapon]
    }
    const defence = generateDefence(resources, hullType.hullClass, aggressiveness, defences)
    if (defence) {
      resources = calculateResources(resources, hullType, defence)
      defences = [ ...defences, defence]
    }
    fitting = generateFitting(resources, hullType.hullClass, fittings)
    if (fitting) {
      resources = calculateResources(resources, hullType, fitting)
      fittings = [ ...fittings, fitting]
    }
  }
  fittings = calculateCargoSpace(fittings, hullType.hullClass)
  return {
    purpose,
    hullType,
    complication: generateComplication(),
    state: generateState(),
    fittings,
    weapons,
    defences,
    resources,
    startMoney,
  }
}

export function generatePurpose() {
  const options = [
    { value: 'Bounty Hunter', weight: 2, aggressiveness: 6, minMoney: 300000, maxMoney: 8000000 },
    { value: 'Pirate',        weight: 2, aggressiveness: 8, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Smuggler',      weight: 2, aggressiveness: 6, minMoney: 300000, maxMoney: 6000000 },
    { value: 'Merchant',      weight: 6, aggressiveness: 4, minMoney: 300000, maxMoney: 8000000 },
    { value: 'Spy',           weight: 1, aggressiveness: 4, minMoney: 300000, maxMoney: 8000000 },
    { value: 'Diplomat',      weight: 2, aggressiveness: 2, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Explorer',      weight: 2, aggressiveness: 2, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Military',      weight: 2, aggressiveness: 10, minMoney: 300000, maxMoney: 70000000 },
    { value: 'Research',      weight: 1, aggressiveness: 2, minMoney: 300000, maxMoney: 5000000 },
    { value: 'Maintenance',   weight: 2, aggressiveness: 2, minMoney: 300000, maxMoney: 5000000 },
  ]
  return pickWeightedRandom(options)
}

export function generateHullType(money) {
  const options = [
    { value: 'Strike Fighter', cost: 200000, hullClass: 'Fighter', power: 5, mass: 2, hard: 1 },
    { value: 'Shuttle', cost: 200000, hullClass: 'Fighter', power: 3, mass: 5, hard: 1 },
    { value: 'Free Merchant', cost: 500000, hullClass: 'Fighter', power: 10, mass: 15, hard: 2 },
    { value: 'Patrol Boat', cost: 2500000, hullClass: 'Fighter', power: 15, mass: 10, hard: 4 },
    { value: 'Corvette', cost: 4000000, hullClass: 'Fighter', power: 15, mass: 15, hard: 6 },
    { value: 'Heavy Frigate', cost: 7000000, hullClass: 'Fighter', power: 25, mass: 20, hard: 8 },
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

export function generateFitting(resources, hullClass, fittings) {
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
    { value: 'Cargo space',                cost: 0,       costMultiplier: false, power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter', multiple: true },
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
    { value: 'Smuggler’s hold',            cost: 2500,    costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Fighter', multiple: true },
    { value: 'Survey sensor array',        cost: 5000,    costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'System drive',               cost: 0,       costMultiplier: false, power: 1, powerMultiplier: true,  mass: 2,   massMultiplier: true,  hullClass: 'Fighter' },
  //{ value: 'Teleportation pads',         cost: 10000,   costMultiplier: false, power: 0, powerMultiplier: false, mass: 0,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Tractor beams',              cost: 10000,   costMultiplier: true,  power: 2, powerMultiplier: false, mass: 1,   massMultiplier: false, hullClass: 'Frigate' },
    { value: 'Vehicle transport fittings', cost: 10000,   costMultiplier: true,  power: 0, powerMultiplier: false, mass: 1,   massMultiplier: true,  hullClass: 'Frigate' },
    { value: 'Workshop',                   cost: 500,     costMultiplier: true,  power: 1, powerMultiplier: false, mass: 0.5, massMultiplier: true,  hullClass: 'Frigate' },
  ]
  return buyRandom(options, hullClass, resources, fittings)
}

export function generateDefence(resources, hullClass, aggressiveness, defences) {
  if (random(1, 10) > (aggressiveness / 4)) {
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
  return buyRandom(options, hullClass, resources, defences)
}

export function generateWeapon(resources, hullClass, aggressiveness, defences) {
  if (random(1, 10) > aggressiveness) {
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
  return buyRandom(options, hullClass, resources, defences)
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
