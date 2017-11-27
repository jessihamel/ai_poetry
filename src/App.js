import React, { Component } from 'react';
import poetry from './data/poetry.csv';
import {csv, text} from 'd3-request';
import Dropdown from './components/Dropdown';
import Visualization from './components/Visualization'
import aiShakespeare from './aishakespeare.svg';
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
          <img src={aiShakespeare} className='App-logo' alt='logo' />
          <h2>Can an A.I. read poetry?</h2>
          <div className='intro-text'>
            Each poem listed below has been run through a linguistic analysis service (<a href="https://www.ibm.com/watson/services/tone-analyzer/">IBM Watson</a>) to determine the levels of five different emotions: joy, sadness, anger, disgust and fear. Although this technology is often used in customer service applications, I wanted to see how it measures up&mdash;or doesn&#39;t&mdash;when fed classic poems.
            <br /><br />
            Give it a try yourself. Pick a poem, adjust the emotion sliders to match your interpretation, and see how it compares to an A.I.
          </div>
          <Dropdown selected={this.state.selectedPoem} changePoem={this._changePoem} options={this.state.poems}/>
          <div className='text-viz'>
            <div className='poem-text'>
              <pre>{this.state.text}</pre>
            </div>
            <Visualization selected={this.state.selectedPoem} poems={this.state.poems} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
