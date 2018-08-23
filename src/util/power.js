
export function calculatePowerForHullClass(option, hullClass) {
  if (option.powerMultiplier) {
    switch (hullClass) {
      case 'Fighter':
        return option.power
      case 'Frigate':
        return option.power * 2
      case 'Cruiser':
        return option.power * 3
      case 'Capital':
        return option.power * 4
    }
  } else {
    return option.power
  }
}

