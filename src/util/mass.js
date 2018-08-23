
export function calculateMassForHullClass(option, hullClass) {
  if (option.massMultiplier) {
    switch (hullClass) {
      case 'Fighter':
        return option.mass
      case 'Frigate':
        return option.mass * 2
      case 'Cruiser':
        return option.mass * 3
      case 'Capital':
        return option.mass * 4
    }
  } else {
    return option.mass
  }
}
