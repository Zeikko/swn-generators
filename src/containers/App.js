import React, { Component } from 'react'
import styled from 'styled-components'

import Ship from './Ship'
import Planet from './Planet'

export default class App extends Component {
  render() {
    return (
      <div>
        <h1>Stars Without Number Generators</h1>
        <Planet />
      </div>
    )
  }
}

