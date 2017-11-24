import React from 'react';

export default class EmotionGraph extends React.Component {
  constructor() {
    super()
  }

  _rotateCoords(theta, x0, y0, cx = 0, cy = 0) {
    const x1 = (Math.cos(theta) * (x0 - cx)) + (Math.sin(theta) * (y0 - cy)) + cx
    const y1 = (Math.cos(theta) * (y0 - cy)) - (Math.sin(theta) * (x0 - cx)) + cy
    return [x1, y1]
  }

  render() {
    const theta = (Math.PI * 2 / Object.keys(this.props.emotions).length)
    const triangleGroups = Object.keys(this.props.emotions).map((emotion, i) => {
      const yScaled = (this.props.emotions[emotion].score * (this.props.size / 2)) / 100
      const apex = this._rotateCoords(theta * i, 0, yScaled)
      const v1 = this._rotateCoords(theta * i, -(yScaled), 0)
      return (
        <g
          key={emotion}
          transform={`translate(${this.props.size / 2}, ${this.props.size / 2})`}
        >
          <path
            className='emotion-path'
            d={`M0 0 L${v1[0]} ${v1[1]} L${apex[0]} ${apex[1]} L${-v1[0]} ${-v1[1]} Z`}
            fill={this.props.emotions[emotion].color}
            opacity='0.8'
          />
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
