import React from 'react';
import EmotionGraph from './EmotionGraph';
import Results from './Results';
import {json} from 'd3-request';

const emotions = ['Anger','Disgust','Joy','Fear','Sadness']
const colors = ['#FF0000','#AAFF00','#FFCE00','#AA00FF','#00AAFF']
// const colors2 = ['#FC1C40','#F5B76A','#653871','#C3DCB4','#152C62']

export default class Visualization extends React.Component {
  constructor() {
    super()
    this.state = {
      emotions: emotions.reduce((a,b,i) => {
        a[b] = {score: '50', color: colors[i]}
        return a
      }, {}),
      analysis: {},
      results: {},
      vizSize: 0,
      showAI: false
    }
    this._onChangeSlider = this._onChangeSlider.bind(this)
    this._showAI = this._showAI.bind(this)
    this._resetResults = this._resetResults.bind(this)
    window.onresize = this._onResize.bind(this)
  }

  componentDidMount() {
    this._setWidth()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected !== nextProps.selected) {
      this._fetchPoemAnalysis(nextProps.selected)
      this._resetEmotions()
    }
  }

  _onChangeSlider(event) {
    // clone so no mutation of state
    const newValues = this._clone(this.state.emotions)
    newValues[event.target.id].score = event.target.value
    this.setState({emotions: newValues})
  }

  _onResize() {
    this._setWidth()
  }

  _setWidth() {
    const vizWidth = Math.floor(this.vizElement.clientWidth)
    this.setState({
      vizSize: vizWidth,
    })
  }

  _fetchPoemAnalysis(poem) {
    json(`${process.env.PUBLIC_URL}/analysis/${poem}.json`, (error, data) => {
      if (error) {
        console.error(error)
        return
      }
      const analysis = emotions.reduce((a,b,i) => {
        a[b] = {score: '50', color: colors[i]}
        return a
      }, {})
      data.document_tone.tone_categories[0].tones.forEach(tone => {
        analysis[tone['tone_name']] = {
          score: tone.score * 100,
          color: colors[emotions.indexOf(tone['tone_name'])]
        }
      })
      this.setState({analysis})
    })
  }

  _resetEmotions() {
    this.setState({
      emotions: emotions.reduce((a,b,i) => {
        a[b] = {score: '50', color: colors[i]}
        return a
      }, {}),
      showAI: false
    })
  }

  _showAI() {
    if (this.state.showAI) { return }
    this.setState({showAI: true})
    this._saveResults()
  }

  _saveResults() {
    const emotions = this._clone(this.state.emotions)
    const analysis = this._clone(this.state.analysis)
    const results = this._clone(this.state.results)
    results[this.props.selected] = {emotions,analysis}
    this.setState({results})
  }

  _resetResults() {
    this.setState({results: {}, showAI: false})
  }
  _clone(objA) {
    // simple deep clone of nested object to avoid mutating state
    const objB = {}
    Object.keys(objA).forEach(key => {
      if (typeof(key) === 'object') {
        this._clone(key)
      }
      objB[key] = Object.assign({}, objA[key])
    })
    return objB
  }

  _returnColorIcon(emotion) {
    return (
      <svg className='color-icon' style={{float: 'left'}} width='18px' height='18px'>
        <path d='M0 0 L0 18 L9 9 Z' fill={this.state.emotions[emotion].color} />
      </svg>
    )
  }

  _returnInputs(isAI) {
    const data = isAI ? this.state.analysis : this.state.emotions
    return Object.keys(data).map(emotion => {
      const inputEl = isAI && !this.state.showAI ?
        <span className='emotion-question'>?</span> :
        (<input
          type='range'
          min='0'
          max='100'
          value={data[emotion].score}
          className='slider'
          id={emotion}
          onChange={isAI ? () => {} : this._onChangeSlider}
          style={{opacity: isAI ? 0.6 : 1}}
        />)
      return (
        <div
          className='emotion-slider'
          key={emotion}
          style={{opacity : isAI && !this.state.showAI ? '0.5' : '1'}}
        >
          {this._returnColorIcon(emotion)}
          <span style={{lineHeight: '18px'}}>{emotion}</span>
          {inputEl}
        </div>
      )
    })
  }

  render() {
    const revealButton = this.state.showAI ? null :
      <div className='reveal-button button'>Click to reveal</div>
    const resetButton = Object.keys(this.state.results).length ?
      (
        <div>
          <h4>Previous Results</h4>
          <div className='reset-button button' onClick={this._resetResults}>Reset All</div>
        </div>
      ) :
      null
    return (
      <div>
        <div className='visualization'>
          <div className='viz-1'>
            <h4>Your interpretation</h4>
            <div className='emotion-sliders'>{this._returnInputs(false)}</div>
            <div ref={c => this.vizElement = c}>
              <EmotionGraph emotions={this.state.emotions} size={this.state.vizSize} showGraph={true} animate={false} />
            </div>
          </div>
          <div className='viz-2' onClick={this._showAI}>
            <h4>The AI&#39;s interpretation</h4>
            <div>
              <div className='emotion-sliders'>{this._returnInputs(true)}</div>
            </div>
            <div style={{position: 'relative'}}>
              {revealButton}
              <EmotionGraph emotions={this.state.analysis} size={this.state.vizSize} showGraph={this.state.showAI} animate={true} />
            </div>
          </div>
        </div>
        {resetButton}
        <Results poems={this.props.poems} results={this.state.results} />
      </div>
    );
  }
}
