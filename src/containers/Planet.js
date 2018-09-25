import React, { Component } from 'react'
import styled from 'styled-components'
import { generatePlanet } from '../generators/planet/planet.js'

export default class App extends Component {
  constructor() {
    super()
    const planet = generatePlanet()
    this.state = { planet, options: { } }
  }

  render() {
    return (
      <div>
        <h2>Planet</h2>
        <div>This generator is work in progress</div>
      </div>
    )
  }
}

