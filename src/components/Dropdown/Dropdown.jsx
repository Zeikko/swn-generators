import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = ({ options, value, onChange }) => (
  <select value={value} onChange={(event) => onChange(event.target.value)}>
    {options.map(option =>
      <option
        key={option.value}>{option.value}
      </option>
    )}
  </select>
)

Dropdown.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
}

export default Dropdown