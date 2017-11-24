import React from 'react';
import EmotionGraph from './EmotionGraph';
import {json} from 'd3-request';

const emotions = ['Anger','Disgust','Fear','Joy','Sadness']
const colors = ['#FF0000','#AAFF00','#AA00FF','#FFCE00','#00AAFF']
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
      vizSize: 0,
      showAI: false
    }
    this._onChangeSlider = this._onChangeSlider.bind(this)
    window.onresize = this._onResize.bind(this)
  }

  componentDidMount() {
    this._setWidth()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.selected !== nextProps.selected) {
      this._fetchPoemAnalysis(nextProps.selected)
    }
  }

  _onChangeSlider(event) {
    // clone so no mutation of state
    const newValues = Object.assign({}, this.state.emotions)
    newValues[event.target.id].score = event.target.value
    this.setState({emotions: newValues})
  }

  _onResize() {
    this._setWidth()
  }

  _setWidth() {
    const vizWidth = this.vizElement.clientWidth
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
      const analysis = {}
      data.document_tone.tone_categories[0].tones.forEach(tone => {
        console.log(tone)
        analysis[tone['tone_name']] = {
          score: tone.score * 100,
          color: colors[emotions.indexOf(tone['tone_name'])]
        }
      })
      console.log(analysis)
      this.setState({analysis})
    })
  }

  _returnColorIcon(emotion) {
    return (
      <svg className='color-icon' style={{float: 'left'}} width='18px' height='18px'>
        <path d='M0 0 L0 18 L9 9 Z' fill={this.state.emotions[emotion].color} />
      </svg>
    )
  }

  render() {
    const inputs = Object.keys(this.state.emotions).map(emotion => {
      return (
        <div className='emotion-slider' key={emotion}>
          {this._returnColorIcon(emotion)}
          <span style={{lineHeight: '18px'}}>{emotion}</span>
          <input
            type='range'
            min='0'
            max='100'
            value={this.state.emotions[emotion].score}
            className='slider'
            id={emotion}
            onChange={this._onChangeSlider}
          />
        </div>
      )
    })
    const aIInputs = Object.keys(this.state.emotions).map(emotion => {
      return (
        <div className='emotion-slider' key={emotion}>
          {this._returnColorIcon(emotion)}
          <span style={{lineHeight: '18px'}}>{emotion}</span>
          <span className='emotion-question'>?</span>
        </div>
      )
    })
    const revealButton = this.state.showAI ? null :
      <div className='reveal-button'>Click to reveal</div>
    return (
      <div className='visualization'>
        <div className='viz-1'>
          <h4>Your interpretation</h4>
          <div className='emotion-sliders'>{inputs}</div>
          <div ref={c => this.vizElement = c}>
            <EmotionGraph emotions={this.state.emotions} size={this.state.vizSize}/>
          </div>
        </div>
        <div className='viz-2'>
          <h4>{`The AI's interpretation`}</h4>
          <div style={{position: 'relative'}}>
            {revealButton}
            <div className='emotion-sliders'>{aIInputs}</div>
          </div>
          <div>
            <EmotionGraph emotions={this.state.analysis} size={this.state.vizSize}/>
          </div>
        </div>
      </div>
    );
  }
}
