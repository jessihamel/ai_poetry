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
          <div className='about'>
           <h4>About</h4>
           <p>One day I was researching some natural language processing APIs and in a moment of whimsy decided to use some poetry as a sample text for testing. Yes it’s a little silly to try to quantify poetry, but it’s fascinating to compare your own interpretation of a poem with the API results. I wanted to create a sort of game out of it and explore different ways of visualizing emotions.</p>
           <p>It’s interesting to see where the language processing model gets it somewhat right and places where it really doesn’t. I’d argue that the algorithms capture a simple poem like Wordsworth’s <span className='italic'>I wandered lonely as a cloud</span> better than they capture T.S. Eliot’s <span className='italic'>Preludes</span>. When I read <span className='italic'>Preludes</span> I get a lot more disgust than the algorithm picks up. And then there’s the problem of being limited to five tones. There are so many rich and nuanced words that one might use to describe the poem that aren’t encompassed by the five words the algorithm is trained to detect. But that’s what’s fun about it. The algorithm results can be a jumping off point for thinking about the poems and their slippery, sometimes contradictory tones.</p>
           <p>The poems are a selection of public domain poems taken from <a href='https://www.poets.org/'>poets.org</a>. I would have liked to include more modern poetry, but most everything written after 1920 is still under copyright. The tone analyzer service used is IBM’s Watson Tone Analyzer. You can read about it <a href='https://console.bluemix.net/docs/services/tone-analyzer/science.html#the-science-behind-the-service'>here</a> or try it yourself <a href=' https://tone-analyzer-demo.mybluemix.net/'>here</a>. The icons used are from <a href='https://thenounproject.com/'>The Noun Project</a> and were created by Aaron K. Kim, Landan Lloyd and Daniel Turner.</p>
           <p>The code for this project is <a href='https://github.com/jessihamel/ai_poetry'>here</a>. You can contact me <a href="http://www.jessihamel.com">here</a>.</p>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
