import React, { Component } from 'react'
import styled from 'styled-components'
import { generateShip } from '../generators/ship'

export default class App extends Component {
  constructor() {
    super()
    const ship = generateShip()
    this.state = { ship }
  }

  generateShip = () => {
    const ship = generateShip()
    this.setState({ ship })
  }

  render() {
    const { ship, ship: { purpose, hullType, complication, state } } = this.state
    return (
      <div>
        <h1>SWN Generators</h1>
        <div>This generator is work in progress</div>
        <div>The red items are placeholders and will not be randomized</div>
        <h2>Ship</h2>
        <Row>
          <Label red>Name: </Label>
          <Attribute>Feri Voyager</Attribute>
        </Row>
        <Row>
          <Label red>Captain Name: </Label>
          <Attribute>Max Kennedy</Attribute>
        </Row>
        <Row>
          <Label>Hull Type: </Label>
          <Attribute>{hullType}</Attribute>
        </Row>
        <Row>
         <Label>Purpose: </Label>
          <Attribute>{purpose.value}</Attribute>
        </Row>
        <Row>
          <Label>State: </Label>
          <Attribute>{state}</Attribute>
        </Row>
        <Row>
          <Label>Complication: </Label>
          <Attribute>{complication}</Attribute>
        </Row>
        <Row>
          <Label red>Weapons: </Label>
          <Attribute>Plasma Beam (+4/3d6, AP 10)</Attribute>
        </Row>
        <Row>
          <Label red>Defenses: </Label>
          <Attribute>None</Attribute>
        </Row>
        <Row>
          <Label red>Fittings: </Label>
          <Attribute>
            <ul>
              <li>Atmospheric Configuration</li>
              <li>Boarding Tubes</li>
              <li>Armory</li>
              <li>Survey Sensors</li>
            </ul>
          </Attribute>
        </Row>
        <Row>
          <Label red>Appearance: </Label>
          <Attribute>
            <ul>
              <li>Badly Maintained</li>
              <li>Bulky</li>
            </ul>
          </Attribute>
        </Row>
        <button onClick={this.generateShip}>Generate</button>
      </div>
    )
  }
}

const Row = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`

const Label = styled.div`
  font-weight: bold;
  width: 8rem;
  color: ${props => props.red && 'red'};
  text-align: right;
  padding-right: 1rem;
`

const Attribute = styled.div`

`
