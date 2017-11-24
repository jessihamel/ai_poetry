import React from 'react';

export default class Dropdown extends React.Component {
  render() {
    const options = this.props.options.map(option => {
      return (
        <option key={option.title} value={option.slug}>{option.title}, {option.author}</option>
      )
    })
    return (
      <select selected={this.props.selected} onChange={this.props.changePoem}>
        {options}
      </select>
    );
  }
}
