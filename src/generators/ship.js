import { pickRandom } from '../util/random'

export function generateShip() {
  return {
    purpose: generatePurpose(),
    hullType: generateHullType(),
    complication: generateComplication(),
    state: generateState(),
  }
}

export function generatePurpose() {
  const options = [
    'Bounty Hunter',
    'Pirate',
    'Smuggler',
    'Merchant',
    'Spy',
    'Diplomat',
    'Explorer',
    'Military',
    'Research',
    'Maintenance',
  ]
  return pickRandom(options)
}

export function generateHullType() {
  const options = [
    'Strike Fighter',
    'Shuttle',
    'Free Merchant',
    'Patrol Boat',
    'Corvette',
    'Heavy Frigate',
    'Bulk Freighter',
    'Fleet Cruiser',
    'Battleship',
    'Carrier',
  ]
  return pickRandom(options)
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