import React, { Component } from 'react';
import poetry from './data/poetry.csv';
import {csv, text} from 'd3-request';
import Dropdown from './components/Dropdown';
import Visualization from './components/Visualization'
import shakespeare from './shakespeare.svg';
import './App.css';

class App extends Component {
  constructor() {
    super()
    this.state = {
      poems: [],
      selectedPoem: null,
      text: ''
    }
    this._changePoem = this._changePoem.bind(this)
  }

  componentDidMount() {
    csv(poetry, (error, data) => {
      this.setState({poems: data})
      this._changePoem(null, data[0].slug)
    })
  }

  _changePoem(event, slug) {
    const selectedPoem = event ? event.target.value : slug
    this.setState({selectedPoem})
    if (selectedPoem) {
      text(`${process.env.PUBLIC_URL}/poems/${selectedPoem}.txt`, (error, data) => {
        this.setState({text: data})
      })
    }
  }

  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={shakespeare} className='App-logo' alt='logo' />
          <h2>Can an A.I. read poetry?</h2>
          <h3>Pick a poem to read, select the primary emotions, and see how an Artificial Intelligence measures up</h3>
          <div className='intro-text'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
          <Dropdown selected={this.state.selectedPoem} changePoem={this._changePoem} options={this.state.poems}/>
          <div className='text-viz'>
            <div className='poem-text'>
              <pre>{this.state.text}</pre>
            </div>
            <Visualization selected={this.state.selectedPoem} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
