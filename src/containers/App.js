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
    const { ship, ship: { name, purpose, hullType, complication, state, weapons, fittings, defences, resources, startMoney } } = this.state
    return (
      <div>
        <h1>SWN Generators</h1>
        <div>This generator is work in progress</div>
        <div>The red items are placeholders and will not be randomized</div>
        <h2>Ship</h2>
        <button onClick={this.generateShip}>Generate</button>
        <Row>
          <Label>Name:</Label>
          <Attribute>{name}</Attribute>
        </Row>
        <Row>
          <Label>Hull Type:</Label>
          <Attribute>{hullType.value}</Attribute>
        </Row>
        <Row>
         <Label>Purpose:</Label>
          <Attribute>{purpose.value}</Attribute>
        </Row>
        <Row>
          <Label>State:</Label>
          <Attribute>{state.value}</Attribute>
        </Row>
        <Row>
          <Label>Complication:</Label>
          <Attribute>{complication.value}</Attribute>
        </Row>
        <Row>
          <Label>Weapons:</Label>
          <Attribute>
            <ul>
              {weapons.map(weapon => <li key={weapon.value}>{weapon.value} ({weapon.damage}, {weapon.qualities})</li>)}
            </ul>
          </Attribute>
        </Row>
        <Row>
          <Label>Defenses:</Label>
          <Attribute>
            <ul>
              {defences.map(defence => <li key={defence.value}>{defence.value}</li>)}
            </ul>
          </Attribute>
        </Row>
        <Row>
          <Label>Fittings:</Label>
          <Attribute>
            <ul>
              {fittings.map(fitting => <li key={fitting.value}>{fitting.value} { fitting.count > 1 && `(${fitting.count})`}</li>)}
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
        <Row>
          <Label>Cost:</Label>
          <Attribute>{startMoney - resources.money}</Attribute>
        </Row>
        <Row>
          <Label>Mass:</Label>
          <Attribute>{hullType.mass - resources.mass} / {hullType.mass}</Attribute>
        </Row>
        <Row>
          <Label>Power:</Label>
          <Attribute>{hullType.power - resources.power} / {hullType.power}</Attribute>
        </Row>
        <Row>
          <Label>Hard:</Label>
          <Attribute>{hullType.hard - resources.hard} / {hullType.hard}</Attribute>
        </Row>
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
