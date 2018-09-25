import React, { Component } from 'react'
import styled from 'styled-components'
import { generateShip } from '../generators/ship'
import Dropdown from '../components/Dropdown/Dropdown'
import hullTypes from '../constants/hull-types'

export default class Ship extends Component {
  constructor() {
    super()
    const ship = generateShip()
    this.state = { ship, options: { } }
  }

  generateShip = () => {
    const ship = generateShip(this.state.options)
    this.setState({ ship })
  }

  setHullType = (hullType) => {
    this.setState({ options: { hullType } })
  }

  render() {
    const { options } = this.state
    const { ship, ship: { name, purpose, hullType, complication, state, weapons, fittings, defences, resources, startMoney, crewCount } } = this.state
    return (
      <div>
        <h2>Spaceship Generator</h2>
        <div>This generator is work in progress</div>
        <h3>Options</h3>
        <Row>
          <Label>Hull Type:</Label>
          <Attribute>
            <Dropdown onChange={this.setHullType} value={options.hullType} options={[{ value: 'Random' }, ...hullTypes]} />
          </Attribute>
        </Row>
        <Row>
          <Label></Label>
          <Attribute>
            <button onClick={this.generateShip}>Generate</button>
          </Attribute>
        </Row>
        <h3>Generated Ship</h3>
        <Row>
          <Label>Name:</Label>
          <Attribute>{name}</Attribute>
        </Row>
        <Row>
          <Label>Hull Type:</Label>
          <Attribute>{hullType.value}</Attribute>
        </Row>
        <Row>
          <Label>Hull Class:</Label>
          <Attribute>{hullType.hullClass}</Attribute>
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
          <Label>Cost:</Label>
          <Attribute>{startMoney - resources.money}</Attribute>
        </Row>
        <Row>
          <Label>6 Months Maintenance Cost:</Label>
          <Attribute>{(startMoney - resources.money) * 0.05}</Attribute>
        </Row>
        <Row>
          <Label>Crew Count:</Label>
          <Attribute>{crewCount}</Attribute>
        </Row>
        <Row>
          <Label>12 Months Crew Upkeep:</Label>
          <Attribute>{crewCount * 43800}</Attribute>
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
        <Row>
          <Label></Label>
          <Attribute>
            <button onClick={this.generateShip}>Generate</button>
          </Attribute>
        </Row>
        <svg width="1500" height="800" id="floorplan"></svg>
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
  width: 15rem;
  color: ${props => props.red && 'red'};
  text-align: right;
  padding-right: 1rem;
`

const Attribute = styled.div`

`
