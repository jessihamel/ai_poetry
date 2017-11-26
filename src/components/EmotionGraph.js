import React from 'react';
import {Motion, spring} from 'react-motion';

export default class EmotionGraph extends React.Component {
  _rotateCoords(theta, x0, y0, cx = 0, cy = 0) {
    const x1 = (Math.cos(theta) * (x0 - cx)) + (Math.sin(theta) * (y0 - cy)) + cx
    const y1 = (Math.cos(theta) * (y0 - cy)) - (Math.sin(theta) * (x0 - cx)) + cy
    return [x1, y1]
  }

  _returnPath(score, rotationAngle, emotion) {
    const yScaled = (score * (this.props.size / 2)) / 100
    const apex = this._rotateCoords(rotationAngle, 0, yScaled)
    const v1 = this._rotateCoords(rotationAngle, -(yScaled), 0)
    return(
      <path
        className='emotion-path'
        d={`M0 0 L${v1[0]} ${v1[1]} L${apex[0]} ${apex[1]} L${-v1[0]} ${-v1[1]} Z`}
        fill={this.props.showGraph ? emotion.color : '#e0e0e0'}
        opacity='0.8'
      />
    )
  }

  render() {
    const theta = (Math.PI * 2 / Object.keys(this.props.emotions).length)
    const triangleGroups = Object.keys(this.props.emotions).map((emotion, i) => {
      const score = this.props.showGraph ? this.props.emotions[emotion].score : 50
      if (this.props.animate) {
        return(
          <g
            key={emotion}
            transform={`translate(${this.props.size / 2}, ${this.props.size / 2})`}
          >
            <Motion defaultStyle={{score: 50}} style={{score: spring(score)}}>
              {value => this._returnPath(value.score, theta * i, this.props.emotions[emotion])}
            </Motion>
          </g>
        )
      }
      return (
        <g
          key={emotion}
          transform={`translate(${this.props.size / 2}, ${this.props.size / 2})`}
        >
          {this._returnPath(score, theta * i, this.props.emotions[emotion])}
        </g>
      )
    })
    return (
      <svg className='emotion-graph' width={this.props.size} height={this.props.size}>
        {triangleGroups}
      </svg>
    );
  }
}
